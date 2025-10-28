import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/get-server-session";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  FriendRequestData,
  FriendRequestResponse,
  FriendshipRequest,
} from "./schema";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const friendshipRequests = await prisma.friendship.findMany({
    where: {
      addresseeId: userId,
      status: "PENDING",
    },
    include: {
      requester: true,
    },
  });

  return NextResponse.json<FriendshipRequest[]>(friendshipRequests);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { email }: FriendRequestData = await request.json();

  if (email === session.user.email) {
    return NextResponse.json(
      { error: "Cannot send request to yourself" },
      { status: 400 },
    );
  }

  // find user by email that is not the current user and has no friendship with the current user
  const addressee = await prisma.user.findFirst({
    where: {
      email,
      sentFriendships: { none: { addresseeId: userId } },
      receivedFriendships: { none: { requesterId: userId } },
    },
    select: {
      id: true,
    },
  });

  if (!addressee) {
    return NextResponse.json(
      { error: "Valid User not found" },
      { status: 404 },
    );
  }

  const friendshipRequest = await prisma.friendship.create({
    data: {
      requester: { connect: { id: userId } },
      addressee: { connect: { id: addressee.id } },
    },
    include: {
      requester: true,
      addressee: true,
    },
  });

  return NextResponse.json(friendshipRequest);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, action }: FriendRequestResponse = await request.json();

  if (action === "DECLINE") {
    await prisma.friendship.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Friend request declined" });
  }

  await prisma.friendship.update({
    where: {
      id,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  return NextResponse.json({ message: "Friend request accepted" });
}
