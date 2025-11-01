import { Message, User } from "@prisma/client";
import { FullFriendship } from "./db-model-types";

export interface ServerToClientEvents {
  friendshipAccepted: (friendship: FullFriendship) => void;
  friendshipRequest: (friendship: FullFriendship) => void;
  friendshipRemoved: (friendshipId: string) => void;
  friendRemoved: (friendId: string) => void;
  friendAdded: (friend: User, friendshipId: string) => void;
  messageSent: (message: Message) => void;
}

export interface ClientToServerEvents {
  friendshipAccepted: (friendship: FullFriendship) => void;
  friendshipRequest: (friendship: FullFriendship) => void;
  friendshipRemoved: (friendshipId: string, friendId: string) => void;
  messageSent: (message: Message) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: User;
}
