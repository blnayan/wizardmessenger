"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { customFetch } from "@/lib/custom-fetch";
import { Friendship, User } from "@prisma/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export interface FriendsProps {
  userId: string;
  friendships: ({ requester: User; addressee: User } & Friendship)[];
}

export function Friends({ userId, friendships }: FriendsProps) {
  const [friendshipList, setFriendshipList] = useState(friendships);

  useEffect(() => {
    setFriendshipList(friendships);
  }, [friendships]);

  async function handleFriendRemove(friendshipId: string) {
    const response = await customFetch.delete(`/api/friends/${friendshipId}`);

    if (!response.ok) {
      toast.error((await response.json()).error);
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
    <Card className="flex flex-row">
      <CardHeader className="flex-1">
        <CardTitle>{friend.name}</CardTitle>
        <CardDescription>{friend.email}</CardDescription>
      </CardHeader>
      <CardFooter>
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
