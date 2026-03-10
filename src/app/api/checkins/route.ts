import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const checkins = await prisma.checkIn.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { date: "desc" },
    });
    return NextResponse.json({ checkins });
  } catch (error) {
    console.error("CheckIn fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch check-ins" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { date, entries } = await req.json();

    if (!date || !entries) {
      return NextResponse.json(
        { error: "Date and entries are required" },
        { status: 400 }
      );
    }

    const dateObj = new Date(date);

    // Upsert each entry
    const operations = Object.entries(entries).map(
      ([userId, data]: [string, any]) =>
        prisma.checkIn.upsert({
          where: {
            date_userId: { date: dateObj, userId },
          },
          create: {
            date: dateObj,
            userId,
            present: data.present || false,
            weight: data.weight ? parseFloat(data.weight) : null,
            comment: data.comment || null,
          },
          update: {
            present: data.present || false,
            weight: data.weight ? parseFloat(data.weight) : null,
            comment: data.comment || null,
          },
        })
    );

    await Promise.all(operations);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CheckIn save error:", error);
    return NextResponse.json(
      { error: "Failed to save check-ins" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const result = await prisma.checkIn.deleteMany({});
    return NextResponse.json({
      success: true,
      message: `Removed ${result.count} check-in record(s)`,
      count: result.count,
    });
  } catch (error) {
    console.error("CheckIn delete error:", error);
    return NextResponse.json(
      { error: "Failed to remove check-in records" },
      { status: 500 }
    );
  }
}
