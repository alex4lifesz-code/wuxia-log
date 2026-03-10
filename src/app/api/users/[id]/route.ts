import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "A valid display name is required" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim().slice(0, 100);

    const user = await prisma.user.update({
      where: { id },
      data: { name: trimmedName },
      select: { id: true, username: true, name: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Prevent deleting the admin user
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (targetUser.username === "admin") {
      return NextResponse.json(
        { error: "Cannot delete the admin user" },
        { status: 403 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
