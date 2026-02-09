import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { EmailAddress, Password } = body;

    if (!EmailAddress || !Password) {
      return NextResponse.json(
        { error: "Email and Password required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: { EmailAddress },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password
    const match = await bcrypt.compare(Password, user.Password);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create token
    const token = jwt.sign(
      {
        userId: user.UserID,
        roleId: user.RoleID,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Create response
    const res = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.UserID,
        name: user.UserName,
        email: user.EmailAddress,
        roleId: user.RoleID,
      },
    });

    // ✅ SET COOKIE (THIS IS KEY)
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
