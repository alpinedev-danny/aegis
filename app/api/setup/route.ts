import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/admin";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Check if admin already exists to prevent multiple accounts
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return NextResponse.json({ error: "System already initialized." }, { status: 403 });
    }

    const { username, password, setupKey } = await req.json();

    // 2. Optional: Simple safety key so random people can't trigger this
    // You can set SETUP_KEY="secret123" in your .env.local
    if (setupKey !== process.env.SETUP_KEY) {
      return NextResponse.json({ error: "Invalid Setup Key" }, { status: 401 });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the Admin
    await Admin.create({
      username,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, message: "Admin credentials established." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}