// app/api/help-requests/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectToDatabase} from '@/app/lib/mongoose'; // تأكد من المسار الصحيح لـ dbConnect
import HelpRequest from '@/app/lib/models/HelpRequestSchema'; // تأكد من المسار الصحيح لمخططك
import mongoose from 'mongoose'; // لاستخدام ObjectId والتحقق منه

export async function PUT(
  req: NextRequest,
    context: { params: any}

) {
  await connectToDatabase();

  const { serviceId } = await context.params; // الحصول على الـ id من الـ URL

  // التحقق من صلاحية الـ ID
  if (!mongoose.Types.ObjectId.isValid(serviceId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid Help Request ID.' },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    // نستخدم findByIdAndUpdate مع $set لضمان تحديث الحقول المرسلة فقط
    // وترك الحقول الأخرى كما هي
    const helpRequest = await HelpRequest.findByIdAndUpdate(
      serviceId,
      { $set: body }, // $set سيقوم بتحديث فقط الحقول الموجودة في الـ body
      {
        new: true, // لإرجاع المستند بعد التحديث
        runValidators: true, // لتشغيل الـ validators (مثل الـ email match)
      }
    );

    if (!helpRequest) {
      return NextResponse.json(
        { success: false, message: 'Help Request not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: helpRequest }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating help request:', error);

    // التعامل مع أخطاء الـ validation بشكل خاص
    if (error.name === 'ValidationError') {
      const errors: { [key: string]: string } = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return NextResponse.json(
        { success: false, message: 'Validation failed.', errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// يمكنك أيضاً إضافة PATCH إذا كنت تفضل استخدامها للتحديثات الجزئية
// ولكن `PUT` مع `$set` في هذا السياق يعمل بنفس الكفاءة للتحديث الجزئي
/*
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // الكود هنا سيكون مماثلاً لدالة PUT
  // يمكن إعادة استخدام نفس منطق التحديث
  return PUT(req, { params });
}
*/