import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* GET ALL USERS */
export async function GET() {
  const users = await prisma.users.findMany({
    include: {
      roles: true,
    },
  });
  return NextResponse.json(users);
}

/* CREATE USER */
export async function POST(req: Request) {
  const body = await req.json();

  const user = await prisma.users.create({
    data: {
      UserName: body.UserName,
      EmailAddress: body.EmailAddress,
      Password: body.Password,
      MobileNo: body.MobileNo,
      RoleID: body.RoleID,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
