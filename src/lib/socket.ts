"use client";

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket-event-types";
import { io, Socket } from "socket.io-client";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
