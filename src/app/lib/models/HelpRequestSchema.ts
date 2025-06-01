import mongoose from "mongoose";

const HelpRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "usersAccount", required: true },
  description: {
    type: String,
    required: true,
  },
  category: {
      type: String,
      required: true,
    },
    contactMethods: {
        type: [String],
        enum: ["phone", "whatsapp", "email"],
        required: true,
    },
    phone: {
      type: String,
    },
  whatsapp: {
    type: String,
  },
  email: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // للتأكد إنه إيميل صحيح
  },
  type: { 
    type: String,
    default: "request", // نوع الطلب (طلب خدمة)
  },
  embedding: {
  type: [Number],
  default: [],
},
}, {
  timestamps: true,
});

const HelpRequest = mongoose.models.HelpRequest || mongoose.model("HelpRequest", HelpRequestSchema);

export default HelpRequest;
