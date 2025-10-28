import { Friendship, User } from "@prisma/client";

export type FullFriendship = {
  requester: User;
  addressee: User;
} & Friendship;
