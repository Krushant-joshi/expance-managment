import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { resolveAuthUser, resolveRequestUserId } from "@/lib/auth";

/* GET ALL CATEGORIES */
export async function GET(req: Request) {
  const auth = resolveAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.categories.findMany({
    where: auth.isAdmin ? undefined : { UserID: auth.userId },
    include: {
      users: true,
      expenses: {
        select: {
          Amount: true,
        },
      },
      sub_categories: true,
    },
  });

  return Response.json(categories);
}

/* CREATE CATEGORY */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resolvedUserId = resolveRequestUserId(req, body.UserID) ?? 0;

    if (!body.CategoryName?.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (!resolvedUserId || resolvedUserId <= 0) {
      return NextResponse.json(
        { error: "Invalid user session. Please login again." },
        { status: 401 }
      );
    }

    const category = await prisma.categories.create({
      data: {
        CategoryName: body.CategoryName.trim(),
        LogoPath: body.LogoPath ?? null,
        IsExpense: Boolean(body.IsExpense),
        IsIncome: Boolean(body.IsIncome),
        Description: body.Description?.trim() || null,
        UserID: resolvedUserId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
