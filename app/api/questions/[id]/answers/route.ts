import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const answerSchema = z.object({
  body: z.string().min(10),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Login required to answer" }, { status: 401 });
  }

  const { id: rawId } = await params;
  const questionId = parseInt(rawId);
  if (isNaN(questionId)) {
    return NextResponse.json({ error: "Invalid question ID" }, { status: 400 });
  }

  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const body   = await req.json();
  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Answer must be at least 10 characters" },
      { status: 400 }
    );
  }

  const answer = await prisma.answer.create({
    data: { body: parsed.data.body, userId: user.userId, questionId },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json({ data: answer }, { status: 201 });
}