import mongoose from "mongoose";

const ProvidingserviceSchema = new mongoose.Schema({
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
  image:{
    type: [String]
  },
  type: { 
    type: String,
    default: "providing", // نوع الطلب (تقديم خدمة)
  },
  embedding: {
  type: [Number],
  default: [],
},
}, {
  timestamps: true,
});

const Providingservice = mongoose.models.Providingservice || mongoose.model("Providingservice", ProvidingserviceSchema);

export default Providingservice;
