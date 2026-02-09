import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const categoryId = Number(id);

  const category = await prisma.categories.findUnique({
    where: { CategoryID: categoryId },
    include: {
      users: true,
      sub_categories: true,
    },
  });

  if (!category) {
    return Response.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  return Response.json(category);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const categoryId = Number(id);
  const body = await req.json();

  const category = await prisma.categories.update({
    where: { CategoryID: categoryId },
    data: {
      CategoryName: body.CategoryName,
      LogoPath: body.LogoPath,
      IsExpense: body.IsExpense,
      IsIncome: body.IsIncome,
      Description: body.Description,
    },
  });

  return Response.json(category);
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.categories.delete({
    where: { CategoryID: Number(id) },
  });

  return Response.json({ message: "Category deleted" });
}
