// lib/models/Request.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IUsers extends Document {
    phone: string;
    whatsapp: string;
    email: string;
  createdAt: Date;
}

const UsersSchema: Schema = new Schema(
    {
      phone: { type: String, required: false },
      whatsapp: { type: String, required: false },
      email: { type: String, required: false },
      createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );

const users = mongoose.models.usersAccount || mongoose.model<IUsers>('usersAccount', UsersSchema);

export default users;
