import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import Providingservice from "@/app/lib/models/ProvidingserviceSchema";
import Busboy from "busboy";
import fs from "fs";
import path from "path";
import os from "os";
import axios from "axios";
import FormData from "form-data";

import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FilesMap {
  [key: string]: {
    filepath: string;
    mimetype: string;
  };
}

interface FieldsMap {
  [key: string]: string;
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const fields: FieldsMap = {};
    const files: FilesMap = {};

    const headersObj = Object.fromEntries(req.headers.entries());
    const busboy = Busboy({ headers: headersObj });

    const parsePromise = new Promise<void>((resolve, reject) => {
      busboy.on(
        "file",
        (
          fieldname: string,
          file: NodeJS.ReadableStream,
          filenameOrObject: string | { filename?: string; mimeType?: string; mimetype?: string; encoding?: string },
          encoding: string,
          mimetype: string
        ) => {
          let filename: string;
          if (typeof filenameOrObject === "object" && filenameOrObject !== null) {
            filename = filenameOrObject.filename || "unknown-file";
            if (!mimetype) {
              mimetype = filenameOrObject.mimeType || filenameOrObject.mimetype || "";
            }
            if (!encoding) {
              encoding = filenameOrObject.encoding || "";
            }
          } else {
            filename = filenameOrObject;
          }

          const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
          if (!allowedTypes.includes(mimetype)) {
            file.resume();
            console.warn(`File [${fieldname}] rejected due to unsupported mimetype: ${mimetype}`);
            return;
          }

          const safeFilename = typeof filename === "string" && filename.trim() !== "" ? filename : `upload-${Date.now()}`;
          const saveTo = path.join(os.tmpdir(), safeFilename);
          const writeStream = fs.createWriteStream(saveTo);
          file.pipe(writeStream);

          files[fieldname] = {
            filepath: saveTo,
            mimetype,
          };

          file.on("end", () => {
            console.log(`File [${fieldname}] finished uploading.`);
          });
        }
      );

      busboy.on("field", (fieldname: string, value: string) => {
        fields[fieldname] = value;
      });

      busboy.on("finish", () => resolve());
      busboy.on("error", (err) => reject(err));
    });

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

    const nodeReadable = Readable.from(stream as any);
    nodeReadable.pipe(busboy);

    await parsePromise;

    await connectToDatabase();

  const realParams = await params;
  const serviceId = realParams.serviceId;
        const service = await Providingservice.findById(serviceId).populate("user", "-password");

    // const service = await Providingservice.findById(serviceId);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // معالجة contactMethods لو هي مصفوفة JSON
    let contactMethodsArray: string[] = [];
    try {
      contactMethodsArray = JSON.parse(fields.contactMethods || "[]");
      if (!Array.isArray(contactMethodsArray)) {
        contactMethodsArray = [];
      }
    } catch {
      contactMethodsArray = [];
    }

    // تحديث الحقول فقط لو اختلفت
    if (fields.description && fields.description !== service.description) {
      service.description = fields.description;
    }

    if (fields.category && fields.category !== service.category) {
      service.category = fields.category;
    }

    if (
      contactMethodsArray.length > 0 &&
      JSON.stringify(contactMethodsArray.sort()) !== JSON.stringify((service.contactMethods || []).sort())
    ) {
      service.contactMethods = contactMethodsArray;
    }

    if ( fields.phone && fields.phone !== service.phone) {
      service.phone = fields.phone;
    }

    if ( fields.whatsapp && fields.whatsapp !== service.whatsapp) {
      service.whatsapp = fields.whatsapp;
    }

    if ( fields.email && fields.email !== service.email) {
      service.email = fields.email;
    }

    // معالجة الصورة لو موجودة
    if (files.image) {
      const imagePath = files.image.filepath;
      try {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString("base64");

        const formData = new FormData();
        formData.append("image", base64Image);

        const imgRes = await axios.post("https://api.imgbb.com/1/upload", formData, {
          headers: formData.getHeaders(),
          params: { key: process.env.IMGBB_API_KEY },
        });

        const imageUrl = imgRes.data.data.url;
        // استبدال الرابط القديم بالرابط الجديد
        service.image = [imageUrl];
      } finally {
        fs.unlinkSync(imagePath);
      }
    }
    // console.log(fields.whatsapp)
    // console.log(service)

    await service.save();

    return NextResponse.json({ message: "Service updated successfully"}, { status: 200 });
  } catch (error) {
    console.error("PUT /api/services/[serviceId] error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}
