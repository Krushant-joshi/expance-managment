import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ===============================
   GET ALL PEOPLES
================================ */

export async function GET() {
  try {
    const peoples = await prisma.peoples.findMany({
      where: {
        IsActive: true,
      },
      orderBy: {
        PeopleName: "asc",
      },
    });

    return NextResponse.json(peoples);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch peoples" },
      { status: 500 }
    );
  }
}
