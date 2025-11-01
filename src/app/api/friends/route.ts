import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/get-server-session";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

// - '/api/friends/requests` (GET list, POST create)
// - `/api/friends/requests/{id}` (PATCH accept/reject, DELETE cancel)
// - `/api/friends/{id}` (DELETE remove)
// - `/api/messages` (POST send, GET list by query params)
// - `/api/messages/{id}` (GET single message, DELETE if needed)

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ recipientId: userId }, { senderId: userId }],
      status: "ACCEPTED",
    },
    include: {
      recipient: true,
      sender: true,
    },
  });

  const friends = friendships.map((friendship) =>
    friendship.recipientId === userId
      ? friendship.sender
      : friendship.recipient,
  );

  return NextResponse.json<User[]>(friends);
}
