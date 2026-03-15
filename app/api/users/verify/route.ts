import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";


export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ valid: false }, { status: 400 });

    // Look for the ID in the database
    const user = await User.findOne({ userId: id });

    if (user) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}