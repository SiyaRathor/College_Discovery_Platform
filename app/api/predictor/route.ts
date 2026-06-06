import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  exam: z.string().min(1),
  rank: z.number().positive(),
});

export async function POST(req: NextRequest) {
  const body   = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Provide exam name and rank", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { exam, rank } = parsed.data;

  const matched = await prisma.collegeExam.findMany({
    where: {
      examName:    { equals: exam, mode: "insensitive" },
      cutoffRank:  { lte: rank },
      closingRank: { gte: rank },
    },
    include: {
      college: {
        select: {
          id: true, name: true, city: true, state: true,
          type: true, stream: true, fees: true,
          rating: true, nirfRank: true, naacGrade: true,
        },
      },
    },
    orderBy: { college: { nirfRank: "asc" } },
  });

  if (matched.length === 0) {
    return NextResponse.json({
      data: [],
      message: `No colleges found for ${exam} rank ${rank}.`,
    });
  }

  const results = matched.map((entry) => ({
    ...entry.college,
    examAccepted: entry.examName,
    cutoffRank:   entry.cutoffRank,
    closingRank:  entry.closingRank,
    chance:       getChance(rank, entry.cutoffRank, entry.closingRank),
  }));

  return NextResponse.json({
    data: results,
    meta: { exam, rank, totalMatched: results.length },
  });
}

function getChance(rank: number, cutoff: number, closing: number): string {
  const range      = closing - cutoff;
  const position   = rank - cutoff;
  const percentile = range > 0 ? position / range : 0;
  if (percentile <= 0.3) return "High";
  if (percentile <= 0.7) return "Medium";
  return "Low";
}