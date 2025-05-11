import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import users from "@/app/lib/models/UsersSchema";
import Providingservice from "@/app/lib/models/ProvidingserviceSchema";
import Busboy from "busboy";
import fs from "fs";
import path from "path";
import os from "os";
import axios from "axios";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const fields: Record<string, any> = {};
    const files: Record<string, any> = {};

    // إعداد busboy
    const busboy = Busboy({ headers: Object.fromEntries(req.headers.entries()) });

    const parsePromise = new Promise<void>((resolve, reject) => {
    interface UploadedFile {
      filepath: string;
      mimetype: string;
    }

    interface FilesRecord {
      [fieldname: string]: UploadedFile;
    }

    busboy.on("file", (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
      // إذا كان filename غير موجود أو ليس سلسلة نصية، قم بتعيين اسم افتراضي
      const safeFilename = typeof filename === "string" && filename.trim() !== "" ? filename : `upload-${Date.now()}`;

      const saveTo = path.join(os.tmpdir(), safeFilename); // استخدم اسم الملف الآمن
      const writeStream = fs.createWriteStream(saveTo);
      file.pipe(writeStream);

      (files as FilesRecord)[fieldname] = {
        filepath: saveTo,
        mimetype,
      };

      file.on("end", () => {
        console.log(`File [${fieldname}] finished uploading.`);
      });
    });

      busboy.on("field", (fieldname, value) => {
        fields[fieldname] = value;
      });

      busboy.on("finish", () => resolve());
      busboy.on("error", (err) => reject(err));
    });

    // تحويل NextRequest.body إلى stream ونمرره لـ busboy
    const reader = req.body?.getReader();
    if (!reader) throw new Error("Request body not found");

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    const nodeReadable = require("stream").Readable.from(stream as any);
    nodeReadable.pipe(busboy);

    await parsePromise;

    // console.log("Fields:", fields);
    // console.log("Files:", files);

    await connectToDatabase();

    const existingUser = await users.findOne({
      $or: [
        { phone: fields.phone },
        { whatsapp: fields.whatsapp },
        { email: fields.email },
      ],
    });

    let userId;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      const newUser = new users({
        phone: fields.phone,
        whatsapp: fields.whatsapp,
        email: fields.email,
      });
      const savedUser = await newUser.save();
      userId = savedUser._id;
    }

    let imageUrl = null;
    if (files.image) {
      const imagePath = files.image.filepath;
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString("base64");

      const formData = new FormData();
      formData.append("image", base64Image);

      const imgRes = await axios.post("https://api.imgbb.com/1/upload", formData, {
        headers: formData.getHeaders(),
        params: { key: process.env.IMGBB_API_KEY },
      });

      imageUrl = imgRes.data.data.url;
    }

    const helpRequest = new Providingservice({
      user: userId,
      description: fields.description,
      phone: fields.phone,
      category: fields.category,
      contactMethods: JSON.parse(fields.contactMethods || "[]"),
      whatsapp: fields.whatsapp,
      email: fields.email,
      image: imageUrl,
    });

    const savedRequest = await helpRequest.save();

    return NextResponse.json({ insertedId: savedRequest._id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/Providingservice error:", error);
    return NextResponse.json({ error: "Failed to create new request" }, { status: 500 });
  }
}
