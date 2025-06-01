import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import usersAccount from "@/app/lib/models/UsersSchema";
import Providingservice from "@/app/lib/models/ProvidingserviceSchema";
import Busboy from "busboy";
import fs from "fs/promises";
import path from "path";
import os from "os";
import axios from "axios";
import FormData from "form-data";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "@/app/lib/jwt";
import { setTokenCookie } from "@/app/lib/cookies";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
import { generateEmbedding } from './generateEmbedding';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Constants
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const PASSWORD_LENGTH = 8;

// Utility functions
const generateRandomPassword = (length = PASSWORD_LENGTH): string => {
    return crypto.randomBytes(Math.ceil(length * 3 / 4)).toString("base64").slice(0, length);
};

const sanitizeFilename = (filename: string): string => {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
};

// Image upload function
const uploadImageToImgBB = async (imagePath: string): Promise<string> => {
    try {
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString("base64");

        const formData = new FormData();
        formData.append("image", base64Image);

        const response = await axios.post(
            "https://api.imgbb.com/1/upload",
            formData,
            {
                headers: formData.getHeaders(),
                params: { key: process.env.IMGBB_API_KEY },
                timeout: 30000, // 30 second timeout
                maxContentLength: MAX_FILE_SIZE,
                maxBodyLength: MAX_FILE_SIZE
            }
        );

        return response.data.data.url;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw new Error("Failed to upload image");
    }
};

// User authentication and creation
const handleUserAuthentication = async (fields: Record<string, any>) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Try to verify existing token
    if (token) {
        try {
            const decoded = verifyToken(token);
            if (decoded && typeof decoded === "object" && "id" in decoded) {
                return decoded.id;
            }
        } catch (err) {
            console.warn("Invalid token, proceeding with user lookup/creation");
        }
    }

    // Look for existing user
    const searchQuery = {
        $or: [
            ...(fields.phone ? [{ phone: fields.phone }] : []),
            ...(fields.whatsapp ? [{ whatsapp: fields.whatsapp }] : []),
            ...(fields.email ? [{ email: fields.email }] : [])
        ]
    };

    if (searchQuery.$or.length > 0) {
        const existingUser = await usersAccount.findOne(searchQuery);
        if (existingUser) {
            return existingUser._id;
        }
    }

    // Create new user
    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 12); // Increased rounds for better security

    const newUser = new usersAccount({
        phone: fields.phone,
        whatsapp: fields.whatsapp,
        email: fields.email,
        password: hashedPassword,
    });

    const savedUser = await newUser.save();
    return savedUser._id;
};

// File parsing with better error handling
const parseMultipartData = async (req: NextRequest): Promise<{
    fields: Record<string, any>;
    files: Record<string, { filepath: string; mimetype: string }>;
}> => {
    return new Promise((resolve, reject) => {
        const fields: Record<string, any> = {};
        const files: Record<string, { filepath: string; mimetype: string }> = {};
        const cleanupFiles: string[] = [];

        const headersObj = Object.fromEntries(req.headers.entries());
        const busboy = Busboy({
            headers: headersObj,
            limits: {
                fileSize: MAX_FILE_SIZE,
                files: 1, // Only allow one file
                fields: 20 // Limit number of fields
            }
        });

        busboy.on("file", (
            fieldname: string,
            file: NodeJS.ReadableStream,
            filenameOrObject: any,
            encoding: string,
            mimetype: string
        ) => {
            let filename: string;

            if (typeof filenameOrObject === "object" && filenameOrObject !== null) {
                filename = filenameOrObject.filename || "unknown-file";
                mimetype = mimetype || filenameOrObject.mimeType || filenameOrObject.mimetype || "";
                encoding = encoding || filenameOrObject.encoding || "";
            } else {
                filename = filenameOrObject;
            }

            // Validate file type
            if (!ALLOWED_IMAGE_TYPES.includes(mimetype)) {
                file.resume();
                console.warn(`File [${fieldname}] rejected: ${mimetype}`);
                return;
            }

            const safeFilename = sanitizeFilename(filename) || `upload-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const saveTo = path.join(os.tmpdir(), safeFilename);

            const writeStream = createWriteStream(saveTo);
            cleanupFiles.push(saveTo);

            // Handle file size limit
            let fileSize = 0;
            file.on("data", (chunk: Buffer) => {
                fileSize += chunk.length;
                if (fileSize > MAX_FILE_SIZE) {
                    file.unpipe();
                    writeStream.destroy();
                    reject(new Error('File too large'));
                    return;
                }
            });

            file.pipe(writeStream);

            files[fieldname] = {
                filepath: saveTo,
                mimetype,
            };

            file.on("end", () => {
                console.log(`File [${fieldname}] uploaded successfully`);
            });

            file.on("error", (err: Error) => {
                console.error(`File upload error: ${err.message}`);
            });
        });

        busboy.on("field", (fieldname: string, value: string) => {
            // Prevent field pollution
            if (fieldname.length > 50 || value.length > 10000) {
                console.warn(`Field ${fieldname} rejected: too large`);
                return;
            }
            fields[fieldname] = value;
        });

        busboy.on("finish", () => {
            resolve({ fields, files });
        });

        busboy.on("error", async (err: Error) => {
            // Cleanup files on error
            await Promise.allSettled(
                cleanupFiles.map(file => fs.unlink(file).catch(() => { }))
            );
            reject(err);
        });

        // Convert NextRequest body to stream
        const reader = req.body?.getReader();
        if (!reader) {
            reject(new Error("Request body not found"));
            return;
        }

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        controller.enqueue(value);
                    }
                    controller.close();
                } catch (error: any) {
                    controller.error(error);
                }
            },
        });

        // Use Node.js Readable stream
        import("stream").then(({ Readable }) => {
            const nodeReadable = Readable.from(stream as any);
            nodeReadable.pipe(busboy);
        }).catch((error: Error) => reject(error));
    });
};

export async function POST(req: NextRequest) {
    let tempFiles: string[] = [];

    try {
        // Parse multipart data
        const { fields, files } = await parseMultipartData(req);

        // Track temp files for cleanup
        tempFiles = Object.values(files).map(file => file.filepath);

        // Connect to database
        await connectToDatabase();

        // Handle user authentication in parallel with other operations
        const [userId, contactMethodsArray] = await Promise.all([
            handleUserAuthentication(fields),
            // Parse contact methods
            Promise.resolve().then(() => {
                try {
                    const parsed = JSON.parse(fields.contactMethods || "[]");
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            })
        ]);

        // Handle image upload and embedding generation in parallel
        const [imageUrl, embedding] = await Promise.all([
            // Upload image if exists
            files.image ? uploadImageToImgBB(files.image.filepath) : Promise.resolve(null),
            // Generate embedding
            Promise.resolve().then(async () => {
                const combinedText = `${fields.category || ''} ${fields.description || ''}`.trim();
                return combinedText ? await generateEmbedding(combinedText) : null;
            })
        ]);

        // Create service request
        const helpRequest = new Providingservice({
            user: userId,
            description: fields.description,
            phone: fields.phone,
            category: fields.category,
            contactMethods: contactMethodsArray,
            whatsapp: fields.whatsapp,
            email: fields.email,
            image: imageUrl,
            embedding,
        });

        await helpRequest.save();

        // Generate token and response
        const token = generateToken({ id: userId.toString() });
        const response = NextResponse.json(
            {
                success: true,
                insertedId: userId,
                serviceId: helpRequest._id
            },
            { status: 201 }
        );

        setTokenCookie(response, token);

        return response;

    } catch (error) {
        console.error("POST /api/Providingservice error:", error);

        // Return appropriate error based on type
        if (error instanceof Error) {
            if (error.message.includes("File too large")) {
                return NextResponse.json(
                    { error: "File size exceeds limit" },
                    { status: 413 }
                );
            }
            if (error.message.includes("Invalid token")) {
                return NextResponse.json(
                    { error: "Authentication failed" },
                    { status: 401 }
                );
            }
        }

        return NextResponse.json(
            {
                error: true,
                message: error instanceof Error ? error.message : "Internal server error",
                ...(process.env.NODE_ENV === 'development' && error instanceof Error && {
                    stack: error.stack
                })
            },
            { status: 500 }
        );

    } finally {
        // Cleanup temporary files
        if (tempFiles.length > 0) {
            await Promise.allSettled(
                tempFiles.map((filepath: string) =>
                    fs.unlink(filepath).catch((err: Error) =>
                        console.warn(`Failed to cleanup ${filepath}:`, err.message)
                    )
                )
            );
        }
    }
}