import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("DATABASE_URL env:", process.env.DATABASE_URL);
    const exercises = await prisma.exercise.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Exercises fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, difficulty, type, story, targetGroup } = await req.json();

    if (!name || !difficulty || !type) {
      return NextResponse.json(
        { error: "Name, difficulty, and type are required" },
        { status: 400 }
      );
    }

    const exercise = await prisma.exercise.create({
      data: { name, difficulty, type, story, targetGroup },
    });

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Exercise create error:", error);
    return NextResponse.json({ error: "Failed to create exercise" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Delete all simplified workout exercises first (foreign key constraint)
    await prisma.simplifiedWorkoutExercise.deleteMany({});
    // Then delete all exercises
    const result = await prisma.exercise.deleteMany({});
    return NextResponse.json({
      message: `All ${result.count} technique(s) removed`,
      deleted: result.count,
    });
  } catch (error) {
    console.error("Exercise bulk delete error:", error);
    return NextResponse.json({ error: "Failed to remove techniques" }, { status: 500 });
  }
}
