import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      UserName,
      EmailAddress,
      Password,
      MobileNo,
      RoleID,
      ProfileImage,
    } = body;

    if (!UserName || !EmailAddress || !Password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const exists = await prisma.users.findUnique({
      where: { EmailAddress },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(Password, 10);

    const user = await prisma.users.create({
      data: {
        UserName,
        EmailAddress,
        Password: hashed,
        MobileNo: MobileNo || "",
        RoleID: RoleID || 2,
        ProfileImage: ProfileImage || null,
      },
    });

    const emailResult = await sendWelcomeEmail({
      to: user.EmailAddress,
      name: user.UserName,
    });

    return NextResponse.json({
      message: emailResult.sent
        ? "Registered successfully. Welcome email sent."
        : "Registered successfully.",
      emailSent: emailResult.sent,
      emailWarning: emailResult.reason,
      userId: user.UserID,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
