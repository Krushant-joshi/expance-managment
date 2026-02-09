import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/* ==========================
   REGISTER USER
========================== */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { UserName, EmailAddress, Password, MobileNo, RoleID, ProfileImage,} = body;

    // ✅ Validation
    if (!UserName || !EmailAddress || !Password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check existing user
    const exists = await prisma.users.findUnique({
      where: { EmailAddress },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const hashed = await bcrypt.hash(Password, 10);

    // ✅ Save user
    const user = await prisma.users.create({
  data: {
    UserName,
    EmailAddress,
    Password: hashed,
    MobileNo: MobileNo || "",
    RoleID: RoleID || 2,        // default = user
    ProfileImage: ProfileImage || null,
  },
});


    return NextResponse.json({
      message: "Registered successfully",
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
