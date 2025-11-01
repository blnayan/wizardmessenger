import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types/socket-event-types";
import { User } from "@prisma/client";
import { getServerCookieSession } from "./lib/get-server-cookie-session";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer);

  io.on("connection", async (socket) => {
    const session = await getServerCookieSession(
      socket.handshake.headers.cookie ?? "",
    );

    if (!session) {
      return socket.disconnect(true);
    }

    const user = session.user as User;
    console.log(`User ${user.name} connected`);
    socket.data.user = user;
    socket.join(user.id);

    socket.on("friendshipAccepted", (friendship) => {
      io.to(friendship.senderId)
        .to(friendship.recipientId)
        .emit("friendshipAccepted", friendship);
      io.to(friendship.senderId).emit(
        "friendAdded",
        friendship.recipient,
        friendship.id,
      );
      io.to(friendship.recipientId).emit(
        "friendAdded",
        friendship.sender,
        friendship.id,
      );
    });

    socket.on("friendshipRequest", (friendship) => {
      io.to(friendship.recipientId).emit("friendshipRequest", friendship);
    });

    socket.on("friendshipRemoved", (friendshipId, friendId) => {
      io.to(friendId).emit("friendshipRemoved", friendshipId);
      io.to(friendId).emit("friendRemoved", socket.data.user.id);
      io.to(socket.data.user.id).emit("friendRemoved", friendId);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.data.user.name} disconnected`);
    });

    socket.on("messageSent", (message) => {
      io.to(message.recipientId).emit("messageSent", message);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
