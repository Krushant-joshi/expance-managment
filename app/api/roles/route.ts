import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(await prisma.roles.findMany());
}

export async function POST(req: Request) {
  const body = await req.json();

  const role = await prisma.roles.create({
    data: {
      RoleName: body.RoleName,
    },
  });

  return NextResponse.json(role, { status: 201 });
}
