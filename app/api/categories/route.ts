import { prisma } from "@/lib/prisma";

/* GET ALL CATEGORIES */
export async function GET() {
  const categories = await prisma.categories.findMany({
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
  const body = await req.json();

  const category = await prisma.categories.create({
    data: {
      CategoryName: body.CategoryName,
      LogoPath: body.LogoPath ?? null,
      IsExpense: body.IsExpense,
      IsIncome: body.IsIncome,
      Description: body.Description,
      UserID: body.UserID,
    },
  });

  return Response.json(category, { status: 201 });
}
