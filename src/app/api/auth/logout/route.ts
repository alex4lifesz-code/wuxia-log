import { NextResponse } from "next/server";

export async function POST() {
  // Logout is handled on client-side by clearing localStorage
  // This endpoint can be used for server-side cleanup if needed in the future
  return NextResponse.json({ success: true });
}
