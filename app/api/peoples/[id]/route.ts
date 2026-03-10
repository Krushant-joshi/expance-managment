import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const people = await prisma.peoples.findUnique({
      where: { PeopleID: Number(id) },
    });

    if (!people) {
      return NextResponse.json({ error: "People not found" }, { status: 404 });
    }

    return NextResponse.json(people);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const peopleName = String(body.PeopleName || "").trim();
    const email = String(body.Email || "").trim();
    const mobileNo = String(body.MobileNo || "").trim();

    if (!peopleName || !email || !mobileNo) {
      return NextResponse.json(
        { error: "People name, email and mobile number are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.peoples.update({
      where: { PeopleID: Number(id) },
      data: {
        PeopleName: peopleName,
        Email: email,
        MobileNo: mobileNo,
        Description: body.Description?.trim() || null,
        IsActive: body.IsActive ?? true,
        ...(body.Password ? { Password: String(body.Password) } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update people" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.peoples.update({
      where: { PeopleID: Number(id) },
      data: { IsActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete people" }, { status: 500 });
  }
}