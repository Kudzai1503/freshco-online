import { NextResponse } from "next/server";

import { createUser } from "@/lib/auth/user-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!body.name?.trim() || !body.email?.trim() || !body.password?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    if (body.password.trim().length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 },
      );
    }

    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create account.",
      },
      { status: 400 },
    );
  }
}
