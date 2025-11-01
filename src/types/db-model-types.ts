import { Friendship, User } from "@prisma/client";

export type FullFriendship = {
  sender: User;
  recipient: User;
} & Friendship;

export type UserWithFriendshipId = User & { friendshipId: string };
