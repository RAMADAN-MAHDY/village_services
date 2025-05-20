import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import Providingservice from "@/app/lib/models/ProvidingserviceSchema";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "مطلوب معرف الخدمة" }, { status: 400 });
    }

    const deletedService = await Providingservice.findByIdAndDelete(id);
    if (!deletedService) {
      return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم حذف الخدمة بنجاح" }, { status: 200 });
  } catch (error: any) {
    console.error("خطأ في حذف الخدمة:", error.message);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
