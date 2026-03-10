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
    const data: Record<string, string | number | null> = {};

    if (typeof body.UserName === "string") data.UserName = body.UserName;
    if (typeof body.EmailAddress === "string") data.EmailAddress = body.EmailAddress;
    if (typeof body.MobileNo === "string") data.MobileNo = body.MobileNo;
    if (typeof body.RoleID === "number") data.RoleID = body.RoleID;
    if (typeof body.ProfileImage === "string" || body.ProfileImage === null) {
      data.ProfileImage = body.ProfileImage;
    }
    if (typeof body.Password === "string" && body.Password.trim()) {
      data.Password = body.Password;
    }

    const updatedUser = await prisma.users.update({
      where: { UserID: userId },
      data,
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
