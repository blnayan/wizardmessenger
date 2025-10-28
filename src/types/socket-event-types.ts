import { User } from "@prisma/client";
import { FullFriendship } from "./db-model-types";

export interface ServerToClientEvents {
  friendshipAccepted: (friendship: FullFriendship) => void;
  friendshipRequest: (friendship: FullFriendship) => void;
}

export interface ClientToServerEvents {
  friendshipAccepted: (friendship: FullFriendship) => void;
  friendshipRequest: (friendship: FullFriendship) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: User;
}
