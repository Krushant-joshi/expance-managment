import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { resolveAuthUser } from "@/lib/auth";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

function getExtension(file: File) {
  if (file.type === "image/png") return ".png";
  if (file.type === "image/jpeg") return ".jpg";
  if (file.type === "image/webp") return ".webp";
  const ext = path.extname(file.name || "").toLowerCase();
  return ext || ".png";
}

export async function POST(req: Request) {
  try {
    const auth = resolveAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image must be under 2 MB" }, { status: 400 });
    }

    const ext = getExtension(file);
    const fileName = `user-${auth.userId}-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "profile-images");
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/profile-images/${fileName}` });
  } catch (error) {
    console.error("Profile image upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
