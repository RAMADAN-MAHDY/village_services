// app/api/requests/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongoose";
import users from "@/app/lib/models/UsersSchema";
import HelpRequest from "@/app/lib/models/HelpRequestSchema"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let userId ;
    if (
      !data.description ||
      !data.category ||
      !Array.isArray(data.contactMethods) ||
      data.contactMethods.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
  
//   console.log(data)

    await connectToDatabase();

    const existingUser = await users.findOne({
        $or: [
          { phone: data.phone, whatsapp: data.whatsapp, email: data.email },
          { phone: data.phone },
          { whatsapp: data.whatsapp },
          { email: data.email }
        ]
      });

      if (existingUser) {

        userId = existingUser._id

      }else{

    const newUser = new users({
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
    });

    const savedUser = await newUser.save();

    userId = savedUser._id ;


      }

    const helpRequest = new HelpRequest({
        user: userId, 
        description: data.description,
        phone: data.phone,
        category: data.category,
        contactMethods: data.contactMethods,
        whatsapp: data.whatsapp,
        email: data.email,
      });
  
      
      const savedRequest = await helpRequest.save();
      
    
// console.log(savedRequest)
    return NextResponse.json({ insertedId: userId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/requests error:", error)
    return NextResponse.json({ error: "Failed to create newUser" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const requests = await users.find().sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
