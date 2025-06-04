// app/api/requests/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import users from "@/app/lib/models/UsersSchema";
import HelpRequest from "@/app/lib/models/HelpRequestSchema"
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "@/app/lib/jwt";
import { setTokenCookie } from "@/app/lib/cookies";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
import { generateEmbedding } from '../Providingservice/generateEmbedding';


export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        let userId;
        if (
            !data.description ||
            !data.category ||
            !Array.isArray(data.contactMethods) ||
            data.contactMethods.length === 0
        ) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        //   console.log(data)
        await connectToDatabase();

        // انشاء باسورد عشوائي create random password
        function generateRandomPassword(length = 6) {
            return crypto.randomBytes(length).toString("base64").slice(0, length);
        }


        // const existingUser = await users.findOne({
        //     $or: [
        //         ...(data.phone ? [{ phone: data.phone }] : []),
        //         ...(data.whatsapp ? [{ whatsapp: data.whatsapp }] : []),
        //         ...(data.email ? [{ email: data.email }] : [])
        //     ]
        // });

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
    const existingUser = await users.findOne({
        $or: [
            ...(data.phone ? [{ phone: data.phone }] : []),
            ...(data.whatsapp ? [{ whatsapp: data.whatsapp }] : []),
            ...(data.email ? [{ email: data.email }] : [])
        ]
    });

    if (existingUser) {
        userId = existingUser._id;
    } else {
        const plainPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const newUser = new users({
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        userId = savedUser._id;
    }
} else {
            // مستخدم موجود => ناخد الـ id من التوكن
            userId = decoded.id;
        }

        
        
        const helpRequest = new HelpRequest({
            user: userId,
            description: data.description,
            phone: data.phone,
            category: data.category,
            contactMethods: data.contactMethods,
            whatsapp: data.whatsapp,
            email: data.email,
            // embedding,
        });
        
        await helpRequest.save();
        
        //        // توليد embedding للنص المدمج من الفئة والوصف
        const combinedText = `${data.category || ''} ${data.description || ''}`.trim();
        await generateEmbedding({text :combinedText , collection : "helprequests" , serviceId : helpRequest._id  });
        // هنا بنولد التوكن بالـ userId
        const token = generateToken({ id: userId.toString() });

        // نضيف الكوكيز للتوكن
        const response = NextResponse.json({ insertedId: userId }, { status: 201 });

        // ارسال الكوكيز للتوكن
        setTokenCookie(response, token);


        // console.log(savedRequest)
        return response;
    } catch (error) {
        console.error("POST /api/requests error:", error)
        return NextResponse.json({ error: "Failed to create newUser" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const requests = await users.find().sort({ createdAt: -1 });

        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
    }
}
