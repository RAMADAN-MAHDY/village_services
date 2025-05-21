import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import Providingservice from "@/app/lib/models/ProvidingserviceSchema";

interface ErrorResponse {
    error: string;
}

export async function DELETE(): Promise<NextResponse> {
    await connectToDatabase();

    try {
        const result = await Providingservice.deleteMany({});
        return NextResponse.json({
            message: "All services deleted successfully",
            deletedCount: result.deletedCount,
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error in DELETE-ALL-SERVICES API:", error.message);
        const errorResponse: ErrorResponse = { error: "Server error occurred while deleting all services" };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
