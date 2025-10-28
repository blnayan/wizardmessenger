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

    socket.data.user = user;
    socket.join(user.id);

    socket.on("friendshipAccepted", (friendship) => {
      io.to(friendship.requesterId)
        .to(friendship.addresseeId)
        .emit("friendshipAccepted", friendship);
    });

    socket.on("friendshipRequest", (friendship) => {
      io.to(friendship.addresseeId).emit("friendshipRequest", friendship);
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
