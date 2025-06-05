import axios from 'axios';
import CountOfReqToChat from '@/app/lib/models/countOfReqToChat';
import { connectToDatabase } from "@/app/lib/mongoose";

// تحديث الكونت أو إنشاء سجل جديد
async function updateCount() {
 await connectToDatabase();

  const today = new Date().toDateString(); // مقارنة اليوم بدون ضبط الساعات

  const latestRecord = await CountOfReqToChat.findOne().sort({ createdAt: -1 });

  if (latestRecord && latestRecord.createdAt.toDateString() === today) {
    // تحديث الكونت إذا كان من نفس اليوم
    await CountOfReqToChat.findOneAndUpdate(
      { _id: latestRecord._id },
      { $inc: { count: 1 } },
      { new: true }
    );
  } else { 
    // إنشاء سجل جديد إذا كان يوم جديد
    await CountOfReqToChat.create({ count: 1 });
  }
}
// https://ai-agent-by-node.vercel.app
// طلب إلى API + تحديث الكونت
async function chatApi(text) {
  try {
    const response = await axios.post('https://ai-agent-by-node.vercel.app/ask', { text });

    await updateCount();

    return response.data;
  } catch (error) {
    console.error('Error generating embedding:', error.response?.data || error.message);
    return []; // ✅ لو حصل خطأ، رجّع مصفوفة فاضية
  }
}

export { chatApi };