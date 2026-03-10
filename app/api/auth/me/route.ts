import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = resolveAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { UserID: auth.userId },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      UserID: user.UserID,
      UserName: user.UserName,
      Email: user.EmailAddress,
      MobileNo: user.MobileNo,
      ProfileImage: user.ProfileImage,
      RoleID: user.RoleID ?? auth.roleId,
      Role: user.roles?.RoleName || (auth.roleId === 1 ? "Administrator" : "User"),
      Created: user.Created,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
