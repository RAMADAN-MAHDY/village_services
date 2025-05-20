import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import HelpRequest from "@/app/lib/models/HelpRequestSchema";
import { NextRequest } from "next/server";
import "@/app/lib/models/UsersSchema";

interface QueryParams {
    id?: string | null;
}

interface ErrorResponse {
    error: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id: QueryParams["id"] = searchParams.get("id");

    try {
        if (id) {
            const service = await HelpRequest.findById(id).populate("user", "-password");
            if (!service) {
                const errorResponse: ErrorResponse = { error: "الخدمة غير موجودة" };
                return NextResponse.json(errorResponse, { status: 404 });
            }
            return NextResponse.json(service, { status: 200 });
        } else {
            const services = await HelpRequest.find().populate("user", "-password");
            return NextResponse.json(services, { status: 200 });
        }
   } catch (error: any) {
    console.error("خطأ في API Providingservice:", error.message);
    const errorResponse: ErrorResponse = { error: "حدث خطأ في السيرفر" };
    return NextResponse.json(errorResponse, { status: 500 });
}

}
