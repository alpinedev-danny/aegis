import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/admin";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    // 1. Find the admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" }, 
        { status: 401 }
      );
    }

    // 2. Compare the provided password with the hashed password in DB
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid credentials" }, 
        { status: 401 }
      );
    }

    // 3. Set an HTTP-only cookie to keep the user logged in
    // In a real app, you'd use a JWT here, but for a simple setup, 
    // we'll set a basic "session" flag.
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}