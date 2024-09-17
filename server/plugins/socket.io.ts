import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { Server } from "socket.io";
import { createRoom } from "../rooms";
import type { ClientToServerEvents, Room, ServerToClientEvents } from "../types";

/**
 * Socket.io plugin.
 *
 * @see https://socket.io/how-to/use-with-nuxt
 */
export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine();
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    // eslint-disable-next-line @typescript-eslint/ban-types
    {},
    {
      userId?: string;
    }
  >();
  io.bind(engine as unknown as Parameters<typeof io.bind>[0]);

  /**
   * Map that holds all current rooms.
   * Key = room ID.
   */
  const ROOMS = new Map<string, Room>();

  io.on("connection", (socket) => {
    console.info(`connected socket "${socket.id}"`);

    socket.on("disconnect", (reason) => {
      console.info(`disconnected socket "${socket.id}" due to "${reason}"`);

      // TODO: delete room if no users are joined for a certain timeout
    });

    /**
     * Emits the current data for the given room to all
     * subscribed room users.
     */
    const emitUpdate = (roomId: string) => {
      if (!ROOMS.has(roomId)) return;
      io.to(roomId).emit("roomUpdate", ROOMS.get(roomId)!);
    };

    /**
     * Connects to the given room and leaves all other rooms.
     */
    const switchRoom = async (roomId: string) => {
      // switch room
      await Promise.all(Array.from(socket.rooms.values()).map((room) => socket.leave(room)));
      await socket.join(roomId);
    };

    socket.on("createRoom", async (...args) => {
      const room = createRoom(...args);
      socket.data.userId = room.moderator;
      await switchRoom(room.id);

      ROOMS.set(room.id, room);
      emitUpdate(room.id);
      console.info(`Created new room for "${room.repository.name}", id: ${room.id}`);
    });

    socket.on("join", async (roomId, ...args) => {
      if (!ROOMS.has(roomId)) {
        console.error(`Tried to join non-existing room "${roomId}"`);
        socket.disconnect();
        return;
      }

      await switchRoom(roomId);
      const room = ROOMS.get(roomId)!;
      const user = room.join(...args);
      socket.data.userId = user.id;

      emitUpdate(roomId);
      console.info(`User "${args[0]}" joined room "${room.id}"`);
    });

    socket.on("selectStory", (roomId, ...args) => {
      if (!ROOMS.has(roomId)) {
        console.error(`Tried to select story for non-existing room "${roomId}"`);
        return;
      }

      const room = ROOMS.get(roomId)!;

      if (socket.data.userId !== room.moderator) {
        console.error(
          `User "${socket.data.userId}" tried to select story for room "${roomId}" but he is not the moderator`,
        );
        return;
      }

      room.selectStory(...args);
      emitUpdate(roomId);
      console.info(`Selected story "${args[0]}" for room "${room.id}"`);
    });

    socket.on("estimate", (roomId, estimation) => {
      if (!ROOMS.has(roomId)) {
        console.error(`Tried to estimate for non-existing room "${roomId}"`);
        return;
      }

      const room = ROOMS.get(roomId)!;

      if (!socket.data.userId) {
        console.error(
          `User of room "${roomId}" tried to estimate but socket has not userId attached.`,
        );
        return;
      }

      room.estimate(socket.data.userId, estimation);
      emitUpdate(roomId);
      console.info(`Estimated for user "${socket.data.userId}" in room "${roomId}"`);
    });

    socket.on("endEstimation", (roomId) => {
      if (!ROOMS.has(roomId)) {
        console.error(`Tried to end estimation for non-existing room "${roomId}"`);
        return;
      }

      const room = ROOMS.get(roomId)!;

      if (socket.data.userId !== room.moderator) {
        console.error(
          `User "${socket.data.userId}" tried to end estimation for room "${roomId}" but he is not the moderator`,
        );
        return;
      }

      room.endEstimation();
      emitUpdate(roomId);
      console.info(`Ended estimation for room "${roomId}"`);
    });

    socket.on("changeName", (roomId, ...args) => {
      if (!ROOMS.has(roomId)) {
        console.error(`Tried to change name for non-existing room "${roomId}"`);
        return;
      }

      const room = ROOMS.get(roomId)!;
      room.changeName(...args);
      emitUpdate(roomId);
      console.info(`Renamed user "${args[0]}" to "${args[1]}" in room "${roomId}"`);
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(
          event.node.req as Parameters<typeof engine.handleRequest>[0],
          event.node.res,
        );
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
