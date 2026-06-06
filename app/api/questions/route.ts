import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const createSchema = z.object({
  title:     z.string().min(10).max(200),
  body:      z.string().min(20),
  collegeId: z.number().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const collegeId = searchParams.get("collegeId");
  const page  = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(20, parseInt(searchParams.get("limit") || "10"));
  const skip  = (page - 1) * limit;

  const where = collegeId ? { collegeId: parseInt(collegeId) } : {};

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user:    { select: { name: true } },
        college: { select: { name: true } },
        answers: { select: { id: true } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  return NextResponse.json({
    data: questions.map((q) => ({
      ...q,
      answerCount: q.answers.length,
      answers: undefined,
    })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: "Login required to ask a question" },
      { status: 401 }
    );
  }

  const body   = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, body: qBody, collegeId } = parsed.data;

  if (collegeId) {
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }
  }

  const question = await prisma.question.create({
    data: { title, body: qBody, userId: user.userId, collegeId },
    include: {
      user:    { select: { name: true } },
      college: { select: { name: true } },
    },
  });

  return NextResponse.json({ data: question }, { status: 201 });
}