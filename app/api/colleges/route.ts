import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search    = searchParams.get("search") || "";
  const state     = searchParams.get("state") || "";
  const stream    = searchParams.get("stream") || "";
  const type      = searchParams.get("type") || "";
  const exam      = searchParams.get("exam") || "";
  const maxFees   = parseInt(searchParams.get("maxFees") || "9999999");
  const minRating = parseFloat(searchParams.get("minRating") || "0");
  const sortBy    = searchParams.get("sortBy") || "nirfRank";
  const order     = searchParams.get("order") === "desc" ? "desc" : "asc";
  const page      = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit     = Math.min(20, parseInt(searchParams.get("limit") || "10"));
  const skip      = (page - 1) * limit;

  const where: any = {
    AND: [
      search ? {
        OR: [
          { name:  { contains: search, mode: "insensitive" } },
          { city:  { contains: search, mode: "insensitive" } },
          { state: { contains: search, mode: "insensitive" } },
        ],
      } : {},
      state  ? { state:  { contains: state,  mode: "insensitive" } } : {},
      stream ? { stream: { equals:   stream } }                      : {},
      type   ? { type:   { equals:   type   } }                      : {},
      { fees:   { lte: maxFees   } },
      { rating: { gte: minRating } },
      exam ? { exams: { some: { examName: { equals: exam, mode: "insensitive" } } } } : {},
    ],
  };

  const allowed = ["nirfRank", "rating", "fees", "totalReviews"];
  const safeSort = allowed.includes(sortBy) ? sortBy : "nirfRank";

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: { [safeSort]: order },
      skip,
      take: limit,
      select: {
        id: true, name: true, city: true, state: true,
        type: true, stream: true, fees: true,
        rating: true, totalReviews: true,
        naacGrade: true, nirfRank: true,
        exams: { select: { examName: true } },
      },
    }),
    prisma.college.count({ where }),
  ]);

  return NextResponse.json({
    data: colleges,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  });
}