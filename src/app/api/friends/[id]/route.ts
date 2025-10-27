import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/get-server-session";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  await prisma.friendship.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({ message: "Friend removed" });
}
