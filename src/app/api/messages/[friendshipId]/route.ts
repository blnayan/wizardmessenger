import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/get-server-session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ friendshipId: string }> },
) {
  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Need to check if user has access to the message

  const userId = session.user.id;
  const { friendshipId } = await params;

  const messages = await prisma.message.findMany({
    where: {
      friendshipId,
      OR: [
        // this ensures only the user that is part of the message has access to it and no other user
        { senderId: userId },
        { recipientId: userId },
      ],
    },
  });

  return NextResponse.json(messages);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ friendshipId: string }> },
) {
  const { content } = await request.json();

  if (typeof content !== "string" || content.trim() === "") {
    return new NextResponse("Invalid content", { status: 400 });
  }

  const session = await getServerSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const { friendshipId } = await params;

  const friendship = await prisma.friendship.findUnique({
    where: {
      id: friendshipId,
      OR: [{ senderId: userId }, { recipientId: userId }],
      status: "ACCEPTED",
    },
  });

  if (!friendship) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const friendId =
    friendship.senderId === userId
      ? friendship.recipientId
      : friendship.senderId;

  const message = await prisma.message.create({
    data: {
      content,
      senderId: userId,
      recipientId: friendId,
      friendshipId: friendship.id,
    },
  });

  return NextResponse.json(message);
}
