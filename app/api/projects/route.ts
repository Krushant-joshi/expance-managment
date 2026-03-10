import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser, resolveRequestUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = resolveAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.projects.findMany({
      where: {
        IsActive: true,
        ...(auth.isAdmin ? {} : { UserID: auth.userId }),
      },
      orderBy: { ProjectName: "asc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = resolveRequestUserId(req, body.UserID);

    const projectName = String(body.ProjectName || "").trim();

    if (!userId) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 401 });
    }

    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const project = await prisma.projects.create({
      data: {
        ProjectName: projectName,
        ProjectLogo: body.ProjectLogo ?? null,
        ProjectStartDate: body.ProjectStartDate ? new Date(body.ProjectStartDate) : null,
        ProjectEndDate: body.ProjectEndDate ? new Date(body.ProjectEndDate) : null,
        ProjectDetail: body.ProjectDetail?.trim() || null,
        Description: body.Description?.trim() || null,
        UserID: userId,
        IsActive: body.IsActive ?? true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
