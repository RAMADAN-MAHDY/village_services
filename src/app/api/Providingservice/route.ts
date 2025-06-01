import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import usersAccount from "@/app/lib/models/UsersSchema";
import Providingservice from "@/app/lib/models/ProvidingserviceSchema";
import Busboy from "busboy";
import fs from "fs";
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
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        const fields: Record<string, any> = {};
        const files: Record<
            string,
            { filepath: string; mimetype: string }
        > = {};

        // busboy بيتوقع headers بصيغة plain object مش Headers instance
        const headersObj = Object.fromEntries(req.headers.entries());
        const busboy = Busboy({ headers: headersObj });

        const parsePromise = new Promise<void>((resolve, reject) => {
            busboy.on(
                "file",
                (
                    fieldname: string,
                    file: NodeJS.ReadableStream,
                    filenameOrObject: any,
                    encoding: string,
                    mimetype: string
                ) => {
                    // لو filename جاي object بدل string، خليه نصه اسم الملف، وحاول تاخد mimeType من جواه لو موجود
                    let filename: string;
                    if (typeof filenameOrObject === "object" && filenameOrObject !== null) {
                        filename = filenameOrObject.filename || "unknown-file";
                        if (!mimetype) {
                            mimetype = filenameOrObject.mimeType || filenameOrObject.mimetype || "";
                        }
                        if (!encoding) {
                            encoding = filenameOrObject.encoding || "";
                        }
                    } else {
                        filename = filenameOrObject;
                    }

                    // console.log({ fieldname, filename, encoding, mimetype });

                    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
                    if (!allowedTypes.includes(mimetype)) {
                        file.resume(); // نتجاهل الملف
                        console.warn(
                            `File [${fieldname}] rejected due to unsupported mimetype: ${mimetype}`
                        );
                        return;
                    }

                    const safeFilename =
                        typeof filename === "string" && filename.trim() !== ""
                            ? filename
                            : `upload-${Date.now()}`;
                    const saveTo = path.join(os.tmpdir(), safeFilename);
                    const writeStream = fs.createWriteStream(saveTo);
                    file.pipe(writeStream);

                    files[fieldname] = {
                        filepath: saveTo,
                        mimetype,
                    };

                    file.on("end", () => {
                        console.log(`File [${fieldname}] finished uploading.`);
                    });
                }
            );

            busboy.on("field", (fieldname, value) => {
                fields[fieldname] = value;
            });

            busboy.on("finish", () => resolve());
            busboy.on("error", (err) => reject(err));
        });

        // تحويل NextRequest.body إلى stream قابل للـ pipe مع busboy
        const reader = req.body?.getReader();
        if (!reader) throw new Error("Request body not found");

        const stream = new ReadableStream({
            async start(controller) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    controller.enqueue(value);
                }
                controller.close();
            },
        });

        // نستخدم stream من النوع NodeJS.Readable
        const { Readable } = await import("stream");
        const nodeReadable = Readable.from(stream as any);
        nodeReadable.pipe(busboy);

        await parsePromise;

        await connectToDatabase();

        // دالة توليد كلمة مرور عشوائية
        function generateRandomPassword(length = 6) {
            return crypto.randomBytes(length).toString("base64").slice(0, length);
        }

        let userId;

        // التحقق من اليوزر عن طريق ال token   and jwt 
        const cookieStore = await cookies();
        const GETtoken = cookieStore.get("token")?.value;

        let decoded: any = null;

        if (GETtoken) {
            try {
                const temp = verifyToken(GETtoken);
                if (temp !== null && typeof temp === "object" && "id" in temp) {
                    decoded = temp;
                }
            } catch (err) {
                // التوكن بايظ أو مش قابل للفك => نسيبه undefined ونتعامل بعدين
                console.warn("Invalid token, creating new user");
            }
        }

        if (!decoded) {
            // تحقق هل المستخدم موجود أصلاً بالبريد أو الواتس أو التليفون
            const existingUser = await usersAccount.findOne({
                $or: [
                    ...(fields.phone ? [{ phone: fields.phone }] : []),
                    ...(fields.whatsapp ? [{ whatsapp: fields.whatsapp }] : []),
                    ...(fields.email ? [{ email: fields.email }] : [])
                ]
            });

            if (existingUser) {
                userId = existingUser._id;
            } else {
                const plainPassword = generateRandomPassword();
                const hashedPassword = await bcrypt.hash(plainPassword, 10);

                const newUser = new usersAccount({
                    phone: fields.phone,
                    whatsapp: fields.whatsapp,
                    email: fields.email,
                    password: hashedPassword,
                });

                const savedUser = await newUser.save();
                userId = savedUser._id;
            }
        } else {
            // مستخدم موجود => ناخد الـ id من التوكن
            userId = decoded.id;
        }

        let imageUrl: string | null = null;

        if (files.image) {
            const imagePath = files.image.filepath;

            try {
                const imageBuffer = fs.readFileSync(imagePath);
                const base64Image = imageBuffer.toString("base64");

                const formData = new FormData();
                formData.append("image", base64Image);

                const imgRes = await axios.post("https://api.imgbb.com/1/upload", formData, {
                    headers: formData.getHeaders(),
                    params: { key: process.env.IMGBB_API_KEY },
                });

                imageUrl = imgRes.data.data.url;
            } finally {
                fs.unlinkSync(imagePath);
            }
        }

        // معالجة contactMethods لو هي مصفوفة JSON
        let contactMethodsArray: any[] = [];
        try {
            contactMethodsArray = JSON.parse(fields.contactMethods || "[]");
            if (!Array.isArray(contactMethodsArray)) {
                contactMethodsArray = [];
            }
        } catch {
            contactMethodsArray = [];
        }

//        // توليد embedding للنص المدمج من الفئة والوصف
        const combinedText = `${fields.category || ''} ${fields.description || ''}`.trim();
        const embedding = await generateEmbedding(combinedText);


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

        const token = generateToken({ id: userId.toString() });

        const response = NextResponse.json({ insertedId: userId }, { status: 201 });
        setTokenCookie(response, token);

        return response;
    } catch (error) {
        console.error("POST /api/Providingservice error:", error);
      return NextResponse.json(
  { 
    error: true,
    message: error instanceof Error ? error.message : String(error),
    stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
  },
  { status: 500 }
);

    }
}
