import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { Server } from "socket.io";

/**
 * Handles an incoming websocket message.
 */
export const handleMessage = (data: unknown) => {
  console.log("Received message:", data);
};

/**
 * Socket.io plugin.
 *
 * @see https://socket.io/how-to/use-with-nuxt
 */
export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  io.on("connection", (socket) => {
    console.log(`connected socket "${socket.id}"`);
    socket.on("message", handleMessage);

    socket.on("disconnect", (reason) => {
      console.log(`disconnected socket "${socket.id}" due to "${reason}"`);
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          const nodeContext = peer.ctx.node;
          const req = nodeContext.req;

          // @ts-expect-error private method
          engine.prepare(req);

          const rawSocket = nodeContext.req.socket;
          const websocket = nodeContext.ws;

          // @ts-expect-error private method
          engine.onWebSocket(req, rawSocket, websocket);
        },
      },
    }),
  );
});
