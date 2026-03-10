import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeDayAssignments } from "@/lib/constants";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.exercise.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Exercise delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete exercise" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { assignedDays } = await req.json();

    if (!Array.isArray(assignedDays)) {
      return NextResponse.json(
        { error: "assignedDays must be an array of day indices (0-6)" },
        { status: 400 }
      );
    }

    // Validate day indices
    const validDays = assignedDays.filter(day => 
      typeof day === 'number' && day >= 0 && day <= 6
    );

    const serializedDays = serializeDayAssignments(validDays);

    const exercise = await prisma.exercise.update({
      where: { id },
      data: { assignedDays: serializedDays },
    });

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Exercise update error:", error);
    return NextResponse.json(
      { error: "Failed to update exercise day assignments" },
      { status: 500 }
    );
  }
}
