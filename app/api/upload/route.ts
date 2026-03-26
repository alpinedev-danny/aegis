import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Log from "@/models/Log";

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const amount = formData.get("amount") as string;
    const userId = formData.get("userId") as string;
    const files = formData.getAll("files") as File[];

    const imagePromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const b64 = Buffer.from(bytes).toString("base64");
      return `data:${file.type};base64,${b64}`;
    });

    const b64Images = await Promise.all(imagePromises);

    const newEntry = await Log.create({
      amount,
      userId,
      status: "Processing",
      images: b64Images,
    });

    return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const logs = await Log.find({}).sort({ date: -1 });
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const status = searchParams.get("status");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    if (!status) return NextResponse.json({ error: "Missing Status" }, { status: 400 });

    await Log.findByIdAndUpdate(id, { status });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Add this to your existing /api/upload/route.ts

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await Log.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}