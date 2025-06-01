
import { NextRequest, NextResponse } from "next/server";
import {chatApi} from './chatApi' 

interface ChatResponse {
    message: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse>> {

const {text} =await req.json();
    // Assuming chatApi is a function that handles the chat logic   
 const result =  await chatApi(text);

    // console.log("Chat API called with text:", result);
    // Return a JSON response indicating success
    
    return NextResponse.json({ message: result });
}
