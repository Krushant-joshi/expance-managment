import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.projects.findUnique({
      where: { ProjectID: Number(id) },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const projectName = String(body.ProjectName || "").trim();

    if (!projectName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const updated = await prisma.projects.update({
      where: { ProjectID: Number(id) },
      data: {
        ProjectName: projectName,
        ProjectLogo: body.ProjectLogo ?? null,
        ProjectStartDate: body.ProjectStartDate ? new Date(body.ProjectStartDate) : null,
        ProjectEndDate: body.ProjectEndDate ? new Date(body.ProjectEndDate) : null,
        ProjectDetail: body.ProjectDetail?.trim() || null,
        Description: body.Description?.trim() || null,
        IsActive: body.IsActive ?? true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.projects.update({
      where: { ProjectID: Number(id) },
      data: { IsActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}