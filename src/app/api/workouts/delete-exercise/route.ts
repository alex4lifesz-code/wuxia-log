import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { exerciseEntryId } = await req.json();

    if (!exerciseEntryId) {
      return NextResponse.json(
        { error: "Exercise entry ID is required" },
        { status: 400 }
      );
    }

    // Find the exercise entry to get its parent workout
    const entry = await prisma.simplifiedWorkoutExercise.findUnique({
      where: { id: exerciseEntryId },
      include: { workout: { include: { simplifiedExercises: true } } },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Exercise entry not found" },
        { status: 404 }
      );
    }

    // If this is the only exercise in the workout, delete the entire workout
    if (entry.workout.simplifiedExercises.length <= 1) {
      await prisma.workout.delete({
        where: { id: entry.workoutId },
      });
    } else {
      // Otherwise just delete the single exercise entry
      await prisma.simplifiedWorkoutExercise.delete({
        where: { id: exerciseEntryId },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Training record deleted successfully",
    });
  } catch (error) {
    console.error("Delete exercise entry error:", error);
    return NextResponse.json(
      { error: "Failed to delete training record" },
      { status: 500 }
    );
  }
}
