import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import HelpRequest from "@/app/lib/models/HelpRequestSchema";
import ProvidingserviceSchema from "@/app/lib/models/ProvidingserviceSchema";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";
import "@/app/lib/models/UsersSchema";

interface ErrorResponse {
    error: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {

    await connectToDatabase();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
        return NextResponse.json({ error: "Unauthorized: Invalid token", decoded }, { status: 401 });
    }

    const userId = decoded.id;
    // console.log(token)

    try {
        const Providingservic = await ProvidingserviceSchema.find({ user: userId }).populate("user", "-password");

        const HelpRequestservic = await HelpRequest.find({ user: userId }).populate("user", "-password");

    // console.log(Providingservic)

        return NextResponse.json({
            Providingservic ,
            HelpRequestservic
        }, { status: 200 });

    } catch (error: any) {
        console.error("خطأ في API Providingservice:", error.message);
        const errorResponse: ErrorResponse = { error: "حدث خطأ في السيرفر" };
        return NextResponse.json(errorResponse, { status: 500 });
    }

}
