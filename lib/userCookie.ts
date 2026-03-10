type CookieUser = {
  UserID?: number | string;
  UserName?: string;
  Role?: string;
  RoleID?: number;
  Email?: string;
};

function tryParseJson(value: string): CookieUser | null {
  try {
    return JSON.parse(value) as CookieUser;
  } catch {
    return null;
  }
}

function decodeRepeatedly(value: string): string {
  let current = value;

  for (let i = 0; i < 3; i += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
    } catch {
      break;
    }
  }

  return current;
}

export function getUserFromCookie(cookieSource: string): CookieUser | null {
  const match = cookieSource.match(/(?:^|;\s*)user=([^;]+)/);
  if (!match) return null;

  const rawValue = match[1];
  return tryParseJson(rawValue) ?? tryParseJson(decodeRepeatedly(rawValue));
}
