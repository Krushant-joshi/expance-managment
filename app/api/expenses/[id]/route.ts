import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ===============================
   GET BY ID
================================ */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const expense = await prisma.expenses.findUnique({
      where: {
        ExpenseID: Number(id),
      },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(expense);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

/* ===============================
   UPDATE
================================ */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updated = await prisma.expenses.update({
      where: {
        ExpenseID: Number(id),
      },
      data: {
        ExpenseDate: new Date(body.ExpenseDate),

        CategoryID: body.CategoryID || null,
        PeopleID: body.PeopleID,

        Amount: body.Amount,

        ExpenseDetail: body.ExpenseDetail,
        Description: body.Description,
        PaymentMethod: body.PaymentMethod || null,
      },
    });

    return NextResponse.json(updated);

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

/* ===============================
   DELETE
================================ */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.expenses.delete({
      where: {
        ExpenseID: Number(id),
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
