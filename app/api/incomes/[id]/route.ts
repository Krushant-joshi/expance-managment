import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const income = await prisma.incomes.findUnique({
      where: {
        IncomeID: Number(id),
      },
    });

    if (!income) {
      return NextResponse.json({ error: "Income not found" }, { status: 404 });
    }

    return NextResponse.json(income);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch income" },
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

    const updated = await prisma.incomes.update({
      where: {
        IncomeID: Number(id),
      },
      data: {
        IncomeDate: new Date(body.IncomeDate),
        CategoryID: body.CategoryID || null,
        SubCategoryID: body.SubCategoryID || null,
        PeopleID: body.PeopleID,
        ProjectID: body.ProjectID || null,
        Amount: body.Amount,
        IncomeDetail: body.IncomeDetail,
        Description: body.Description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update income" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.incomes.delete({
      where: {
        IncomeID: Number(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete income" },
      { status: 500 }
    );
  }
}
