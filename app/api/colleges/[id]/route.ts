import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: Request, props: Props) {
  const params = await props.params;
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" } },
      exams: true,
      questions: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user:    { select: { name: true } },
          answers: { select: { id: true } },
        },
      },
    },
  });

  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  return NextResponse.json({ data: college });
}