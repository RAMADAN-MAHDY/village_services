import mongoose, { Schema, Document } from 'mongoose';

export interface IUsers extends Document {
  count: number; // تغيير نوع count إلى رقم ليسهل التعامل معه
  createdAt: Date;
}

const countOfReqToChatSchema: Schema = new Schema(
  {
    count: { type: Number, required: true, default: 1 }, // العدد يبدأ من 1
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CountOfReqToChat =
  mongoose.models.CountOfReqToChat || mongoose.model<IUsers>('CountOfReqToChat', countOfReqToChatSchema);

export default CountOfReqToChat;

