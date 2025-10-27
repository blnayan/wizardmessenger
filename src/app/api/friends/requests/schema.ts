import { Friendship, User } from "@prisma/client";

export type FriendshipRequest = { requester: User } & Friendship;

export type FriendRequestData = { email: string };

export type FriendRequestResponse = {
  id: string;
  action: "ACCEPT" | "DECLINE";
};
