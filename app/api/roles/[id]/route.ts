import { prisma } from "@/lib/prisma";

/* UPDATE ROLE */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const roleId = Number(id);

  if (isNaN(roleId)) {
    return Response.json(
      { message: "Invalid role id" },
      { status: 400 }
    );
  }

  const body = await req.json();

  const role = await prisma.roles.update({
    where: { RoleID: roleId },
    data: {
      RoleName: body.RoleName,
    },
  });

  return Response.json(role);
}

/* DELETE ROLE */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const roleId = Number(id);

  if (isNaN(roleId)) {
    return Response.json(
      { message: "Invalid role id" },
      { status: 400 }
    );
  }

  await prisma.roles.delete({
    where: { RoleID: roleId },
  });

  return Response.json({ message: "Role deleted" });
}
