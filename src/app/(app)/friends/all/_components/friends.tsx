"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { safeFetch } from "@/lib/safe-fetch";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { FullFriendship } from "@/types/db-model-types";

export interface FriendsProps {
  userId: string;
  friendships: FullFriendship[];
}

export function Friends({ userId, friendships }: FriendsProps) {
  const [friendshipList, setFriendshipList] = useState(friendships);

  useEffect(() => {
    setFriendshipList(friendships);
  }, [friendships]);

  useEffect(() => {
    socket.on("friendshipAccepted", (friendship) => {
      setFriendshipList((prev) => [...prev, friendship]);
    });

    return () => {
      socket.off("friendshipAccepted");
    };
  }, []);

  async function handleFriendRemove(friendshipId: string) {
    const result = await safeFetch.delete(`/api/friends/${friendshipId}`);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setFriendshipList((prev) =>
      prev.filter((friendship) => friendship.id !== friendshipId),
    );

    toast.success("Friend removed successfully");
  }

  return friendshipList.map((friendship) => {
    const friend =
      friendship.addresseeId === userId
        ? friendship.requester
        : friendship.addressee;

    return (
      <Friend
        key={friendship.id}
        friendshipId={friendship.id}
        friend={friend}
        handleFriendRemove={handleFriendRemove}
      />
    );
  });
}

export interface FriendProps {
  friendshipId: string;
  friend: User;
  handleFriendRemove: (friendshipId: string) => Promise<void>;
}

export function Friend({
  friendshipId,
  friend,
  handleFriendRemove,
}: FriendProps) {
  return (
    <Card className="flex flex-row py-4">
      <CardHeader className="flex-1 px-4">
        <CardTitle>{friend.name}</CardTitle>
        <CardDescription>{friend.email}</CardDescription>
      </CardHeader>
      <CardFooter className="px-4">
        <Button
          variant="destructive"
          className="hover:cursor-pointer"
          onClick={() => handleFriendRemove(friendshipId)}
        >
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
