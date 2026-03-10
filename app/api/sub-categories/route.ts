import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser, resolveRequestUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = resolveAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subCategories = await prisma.sub_categories.findMany({
      where: {
        IsActive: true,
        ...(auth.isAdmin ? {} : { UserID: auth.userId }),
      },
      include: {
        categories: {
          select: {
            CategoryID: true,
            CategoryName: true,
          },
        },
      },
      orderBy: { SubCategoryName: "asc" },
    });

    return NextResponse.json(subCategories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch sub categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = resolveRequestUserId(req, body.UserID);

    const subCategoryName = String(body.SubCategoryName || "").trim();
    const categoryId = Number(body.CategoryID);

    if (!userId) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
    }

    if (!subCategoryName || !categoryId) {
      return NextResponse.json(
        { error: "Sub category name and category are required" },
        { status: 400 }
      );
    }

    const subCategory = await prisma.sub_categories.create({
      data: {
        SubCategoryName: subCategoryName,
        CategoryID: categoryId,
        LogoPath: body.LogoPath ?? null,
        IsExpense: Boolean(body.IsExpense),
        IsIncome: Boolean(body.IsIncome),
        Description: body.Description?.trim() || null,
        Sequence: body.Sequence ?? null,
        UserID: userId,
        IsActive: body.IsActive ?? true,
      },
    });

    return NextResponse.json(subCategory, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create sub category" },
      { status: 500 }
    );
  }
}
