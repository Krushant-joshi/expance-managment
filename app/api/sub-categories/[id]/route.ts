import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subCategory = await prisma.sub_categories.findUnique({
      where: { SubCategoryID: Number(id) },
      include: {
        categories: {
          select: {
            CategoryID: true,
            CategoryName: true,
          },
        },
      },
    });

    if (!subCategory) {
      return NextResponse.json(
        { error: "Sub category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subCategory);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch sub category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const subCategoryName = String(body.SubCategoryName || "").trim();
    const categoryId = Number(body.CategoryID);

    if (!subCategoryName || !categoryId) {
      return NextResponse.json(
        { error: "Sub category name and category are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.sub_categories.update({
      where: { SubCategoryID: Number(id) },
      data: {
        SubCategoryName: subCategoryName,
        CategoryID: categoryId,
        LogoPath: body.LogoPath ?? null,
        IsExpense: Boolean(body.IsExpense),
        IsIncome: Boolean(body.IsIncome),
        Description: body.Description?.trim() || null,
        Sequence: body.Sequence ?? null,
        IsActive: body.IsActive ?? true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update sub category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.sub_categories.update({
      where: { SubCategoryID: Number(id) },
      data: { IsActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete sub category" },
      { status: 500 }
    );
  }
}