import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
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