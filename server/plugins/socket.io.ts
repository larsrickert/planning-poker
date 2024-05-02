import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { Server } from "socket.io";
import type { ClientToServerEvents, Lobby, ServerToClientEvents } from "~/stores/socket-store";

/**
 * Socket.io plugin.
 *
 * @see https://socket.io/how-to/use-with-nuxt
 */
export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine();
  const io = new Server<ClientToServerEvents, ServerToClientEvents>();
  io.bind(engine);

  /**
   * Map that holds all current lobbies.
   * Key = ID.
   */
  const LOBBIES: Record<string, Lobby> = {};

  io.on("connection", (socket) => {
    console.info(`connected socket "${socket.id}"`);

    socket.on("disconnect", (reason) => {
      console.info(`disconnected socket "${socket.id}" due to "${reason}"`);
    });

    socket.on("createLobby", (data) => {
      // TODO: add error handling when lobby already exists
      const newLobby: Lobby = {
        id: crypto.randomUUID(),
        repository: data.repository,
        users: [{ name: data.username, role: "admin" }],
      };

      LOBBIES[newLobby.id] = newLobby;
      socket.emit("lobbyUpdate", newLobby);
      console.info(`Created new lobby for "${newLobby.repository}"`);
    });

    socket.on("joinLobby", (data) => {
      // TODO: add error handling when lobby does not exist
      if (!(data.id in LOBBIES)) {
        console.error(`Tried to join non-existing lobby "${data.id}"`);
        socket.disconnect();
        return;
      }

      const lobby = LOBBIES[data.id];

      if (!lobby.users.find((i) => i.name === data.username)) {
        lobby.users.push({ name: data.username, role: "user" });
        LOBBIES[data.id] = lobby;
      }

      socket.emit("lobbyUpdate", lobby);
    });

    socket.on("selectIssue", (lobbyId, issueNumber) => {
      // TODO: add error handling when lobby does not exist
      if (!(lobbyId in LOBBIES)) {
        console.error(`Tried to select issue for non-existing lobby "${lobbyId}"`);
        socket.disconnect();
        return;
      }

      LOBBIES[lobbyId].selectedIssue = issueNumber;
      socket.emit("lobbyUpdate", LOBBIES[lobbyId]);
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
