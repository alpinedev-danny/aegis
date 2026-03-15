import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// Fetch all authorized IDs
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch IDs" }, { status: 500 });
  }
}

// Create new ID (Keep your existing POST logic)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const newUser = await User.create({ userId });
    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json({ error: "ID already exists" }, { status: 500 });
  }
}

// Delete an ID
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // This is the MongoDB _id
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}