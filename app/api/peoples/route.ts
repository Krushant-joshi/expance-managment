import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { resolveAuthUser, resolveRequestUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = resolveAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const peoples = await prisma.peoples.findMany({
      where: {
        IsActive: true,
        ...(auth.isAdmin ? {} : { UserID: auth.userId }),
      },
      orderBy: { PeopleName: "asc" },
    });

    return NextResponse.json(peoples);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch peoples" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = resolveRequestUserId(req, body.UserID);

    if (!userId) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
    }

    const peopleName = String(body.PeopleName || "").trim();
    const email = String(body.Email || "").trim();
    const mobileNo = String(body.MobileNo || "").trim();

    if (!peopleName || !email || !mobileNo) {
      return NextResponse.json(
        { error: "People name, email and mobile number are required" },
        { status: 400 }
      );
    }

    const people = await prisma.peoples.create({
      data: {
        PeopleCode: String(body.PeopleCode || `P-${Date.now()}`),
        Password: String(body.Password || randomUUID()),
        PeopleName: peopleName,
        Email: email,
        MobileNo: mobileNo,
        Description: body.Description?.trim() || null,
        UserID: userId,
        IsActive: body.IsActive ?? true,
      },
    });

    return NextResponse.json(people, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create people" }, { status: 500 });
  }
}
