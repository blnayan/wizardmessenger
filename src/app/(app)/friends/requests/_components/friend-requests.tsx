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
import { socket } from "@/lib/socket";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FullFriendship } from "@/types/db-model-types";

export interface FriendRequestsProps {
  userId: string;
  friendshipRequests: FullFriendship[];
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

  useEffect(() => {
    socket.on("friendshipRequest", (friendship) => {
      setFriendshipRequestList((prev) => [...prev, friendship]);
    });

    return () => {
      socket.off("friendshipRequest");
    };
  }, []);

  async function handleRequestAction(
    friendship: FullFriendship,
    action: "ACCEPT" | "DECLINE",
  ) {
    const result = await safeFetch.patch(`/api/friends/requests`, {
      id: friendship.id,
      action,
    });

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setFriendshipRequestList((prev) =>
      prev.filter((request) => request.id !== friendship.id),
    );

    if (action === "ACCEPT") {
      socket.emit("friendshipAccepted", friendship);
    }

    toast.success(`Friend request ${action.toLowerCase()}ed.`);
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
  friendshipRequest: FullFriendship;
  handleRequestAction: (
    friendship: FullFriendship,
    action: "ACCEPT" | "DECLINE",
  ) => Promise<void>;
}

export function FriendshipRequest({
  friendshipRequest,
  handleRequestAction,
}: FriendshipRequestProps) {
  const { sender } = friendshipRequest;

  return (
    <Card className="flex flex-row py-4">
      <CardHeader className="flex-1 px-4">
        <CardTitle>{sender.name}</CardTitle>
        <CardDescription>{sender.email}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row gap-4 px-4">
        <Button
          variant="outline"
          size="icon"
          className="hover:cursor-pointer"
          onClick={() => handleRequestAction(friendshipRequest, "ACCEPT")}
        >
          <Check />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hover:cursor-pointer"
          onClick={() => handleRequestAction(friendshipRequest, "DECLINE")}
        >
          <X />
        </Button>
      </CardFooter>
    </Card>
  );
}
