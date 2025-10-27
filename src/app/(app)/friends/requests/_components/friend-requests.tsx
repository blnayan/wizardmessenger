"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { customFetch } from "@/lib/custom-fetch";
import { Friendship, User } from "@prisma/client";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { set } from "zod/v3";

export interface FriendRequestsProps {
  userId: string;
  friendshipRequests: ({ requester: User } & Friendship)[];
}

export function FriendshipRequests({
  userId,
  friendshipRequests,
}: FriendRequestsProps) {
  const [friendshipRequestList, setFriendshipRequestList] =
    useState(friendshipRequests);

  useEffect(() => {
    setFriendshipRequestList(friendshipRequests);
  }, [friendshipRequests]);

  async function handleRequestAction(id: string, action: "ACCEPT" | "DECLINE") {
    const response = await customFetch.patch(`/api/friends/requests`, {
      id,
      action,
    });

    if (!response.ok) {
      toast.error((await response.json()).error);
      return;
    }

    setFriendshipRequestList((prev) =>
      prev.filter((request) => request.id !== id),
    );

    toast.success(`Friend request ${action.toLowerCase()}ed.`);
    return;
  }

  return friendshipRequestList.map((friendshipRequest) => (
    <FriendshipRequest
      key={friendshipRequest.id}
      friendshipRequest={friendshipRequest}
      handleRequestAction={handleRequestAction}
    />
  ));
}

export interface FriendshipRequestProps {
  friendshipRequest: { requester: User } & Friendship;
  handleRequestAction: (
    id: string,
    action: "ACCEPT" | "DECLINE",
  ) => Promise<void>;
}

export function FriendshipRequest({
  friendshipRequest,
  handleRequestAction,
}: FriendshipRequestProps) {
  const { requester } = friendshipRequest;

  return (
    <Card className="flex flex-row">
      <CardHeader className="flex-1">
        <CardTitle>{requester.name}</CardTitle>
        <CardDescription>{requester.email}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row gap-4">
        <Button
          variant="outline"
          size="icon"
          className="hover:cursor-pointer"
          onClick={() => handleRequestAction(friendshipRequest.id, "ACCEPT")}
        >
          <Check />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hover:cursor-pointer"
          onClick={() => handleRequestAction(friendshipRequest.id, "DECLINE")}
        >
          <X />
        </Button>
      </CardFooter>
    </Card>
  );
}
