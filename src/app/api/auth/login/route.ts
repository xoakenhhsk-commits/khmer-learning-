import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Mock successful login
    const mockUser = {
      id: "user-existing",
      name: email.split("@")[0],
      email,
      xp: 500,
      level: 5,
      streakDays: 3,
      hearts: 4,
      role: "USER",
    };

    return NextResponse.json({ message: "Success", user: mockUser }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
