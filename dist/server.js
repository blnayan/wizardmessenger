"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = require("node:http");
const next_1 = __importDefault(require("next"));
const socket_io_1 = require("socket.io");
const get_server_cookie_session_1 = require("./lib/get-server-cookie-session");
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = (0, next_1.default)({ dev, hostname, port });
const handler = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = (0, node_http_1.createServer)(handler);
    const io = new socket_io_1.Server(httpServer);
    io.on("connection", async (socket) => {
        var _a;
        const session = await (0, get_server_cookie_session_1.getServerCookieSession)((_a = socket.handshake.headers.cookie) !== null && _a !== void 0 ? _a : "");
        if (!session) {
            return socket.disconnect(true);
        }
        const user = session.user;
        console.log(`User ${user.name} connected`);
        socket.data.user = user;
        socket.join(user.id);
        socket.on("friendshipAccepted", (friendship) => {
            io.to(friendship.senderId)
                .to(friendship.recipientId)
                .emit("friendshipAccepted", friendship);
            io.to(friendship.senderId).emit("friendAdded", friendship.recipient, friendship.id);
            io.to(friendship.recipientId).emit("friendAdded", friendship.sender, friendship.id);
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
