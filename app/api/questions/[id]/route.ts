import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: Request, props: Props) {
  const params = await props.params;
  const questionId = parseInt(params.id);

  if (isNaN(questionId)) {
    return NextResponse.json({ error: "Invalid question ID" }, { status: 400 });
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      user:    { select: { name: true } },
      college: { select: { name: true } },
      answers: {
        orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ data: question });
}