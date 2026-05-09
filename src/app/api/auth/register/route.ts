import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Uncomment when DB is ready
// import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Mock successful registration
    const mockUser = {
      id: "user-" + Date.now(),
      name,
      email,
      xp: 0,
      level: 1,
      streakDays: 0,
      hearts: 5,
      role: "USER",
    };

    return NextResponse.json({ message: "Success", user: mockUser }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
