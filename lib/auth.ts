import jwt from "jsonwebtoken";

export type AuthUser = {
  userId: number;
  roleId: number;
  isAdmin: boolean;
};

export function resolveAuthUser(req: Request): AuthUser | null {
  const cookieHeader = req.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

  if (!token || !process.env.JWT_SECRET) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId?: number;
      roleId?: number;
    };
    const userId = Number(decoded?.userId);
    const roleId = Number(decoded?.roleId);

    if (!Number.isFinite(userId) || userId <= 0) return null;
    const normalizedRole = Number.isFinite(roleId) && roleId > 0 ? roleId : 2;

    return {
      userId,
      roleId: normalizedRole,
      isAdmin: normalizedRole === 1,
    };
  } catch {
    return null;
  }
}

export function resolveRequestUserId(
  req: Request,
  bodyUserId?: unknown
): number | null {
  if (typeof bodyUserId === "number" && bodyUserId > 0) return bodyUserId;
  const auth = resolveAuthUser(req);
  return auth?.userId ?? null;
}
