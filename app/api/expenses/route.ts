import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ==============================
   GET: Fetch All Expenses
================================ */
export async function GET() {
  try {
    const expenses = await prisma.expenses.findMany({
      include: {
        categories: true,
        sub_categories: true,
        peoples: true,
        projects: true,
        expense_status: true,
      },
      orderBy: {
        ExpenseDate: "desc",
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

/* ==============================
   POST: Add New Expense
================================ */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const expense = await prisma.expenses.create({
      data: {
        ExpenseDate: new Date(body.ExpenseDate),

        CategoryID: body.CategoryID || null,
        SubCategoryID: body.SubCategoryID || null,
        PeopleID: body.PeopleID,
        ProjectID: body.ProjectID || null,

        Amount: body.Amount,

        ExpenseDetail: body.ExpenseDetail || null,
        Description: body.Description || null,

        // ✅ FIXED
        PaymentMethod: body.PaymentMethod || null,

        UserID: body.UserID,
        StatusID: body.StatusID || 1,
      },
    });

    return NextResponse.json(expense);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
