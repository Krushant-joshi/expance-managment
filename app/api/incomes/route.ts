import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { resolveAuthUser, resolveRequestUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = resolveAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incomes = await prisma.incomes.findMany({
      where: auth.isAdmin ? undefined : { UserID: auth.userId },
      include: {
        categories: true,
        sub_categories: true,
        peoples: true,
        projects: true,
      },
      orderBy: {
        IncomeDate: "desc",
      },
    });

    return NextResponse.json(incomes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch incomes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = resolveRequestUserId(req, body.UserID);
    const peopleName = body.PeopleName?.trim();
    let peopleId = body.PeopleID ? Number(body.PeopleID) : null;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    if (!peopleId && peopleName) {
      const existing = await prisma.peoples.findFirst({
        where: {
          UserID: userId,
          PeopleName: {
            equals: peopleName,
          },
        },
      });

      if (existing) {
        peopleId = existing.PeopleID;
      } else {
        const slug = peopleName.toLowerCase().replace(/[^a-z0-9]+/g, "");
        const unique = Date.now();
        const createdPerson = await prisma.peoples.create({
        data: {
            PeopleCode: `P-${unique}`,
            Password: randomUUID(),
            PeopleName: peopleName,
            Email: `${slug || "person"}-${unique}@local.expense`,
            MobileNo: "0000000000",
            Description: "Auto-created from income entry",
            UserID: userId,
            IsActive: true,
          },
        });

        peopleId = createdPerson.PeopleID;
      }
    }

    if (!peopleId) {
      return NextResponse.json(
        { error: "Received From is required" },
        { status: 400 }
      );
    }

    const income = await prisma.incomes.create({
      data: {
        IncomeDate: new Date(body.IncomeDate),
        CategoryID: body.CategoryID || null,
        SubCategoryID: body.SubCategoryID || null,
        PeopleID: peopleId,
        ProjectID: body.ProjectID || null,
        Amount: body.Amount,
        IncomeDetail: body.IncomeDetail || null,
        Description: body.Description || null,
          UserID: userId,
        },
      });

    return NextResponse.json(income);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create income" },
      { status: 500 }
    );
  }
}
