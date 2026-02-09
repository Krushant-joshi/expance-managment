import { prisma } from "@/lib/prisma";

/* GET USER BY ID */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return Response.json(
      { message: "Invalid user id" },
      { status: 400 }
    );
  }

  const user = await prisma.users.findUnique({
    where: { UserID: userId },
    include: { roles: true },
  });

  if (!user) {
    return Response.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return Response.json(user);
}

/* UPDATE USER */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = Number(id);

    if (isNaN(userId)) {
      return Response.json(
        { message: "Invalid user id" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updatedUser = await prisma.users.update({
      where: { UserID: userId },
      data: {
        UserName: body.UserName,
        EmailAddress: body.EmailAddress,
        Password: body.Password,
        MobileNo: body.MobileNo,
        RoleID: body.RoleID,
      },
    });

    return Response.json(updatedUser);
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* DELETE USER */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = Number(id);

  await prisma.users.delete({
    where: { UserID: userId },
  });

  return Response.json({ message: "User deleted" });
}
