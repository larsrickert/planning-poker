import { defineStore } from "pinia";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { ClientToServerEvents, RoomDto, ServerToClientEvents } from "~/server/types";

export const useRoomStore = defineStore("room", () => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
  });

  const authStore = useAuthStore();

  /**
   * Current room state.
   */
  const room = ref<RoomDto>();

  socket.on("roomUpdate", (newRoom) => (room.value = newRoom));

  /**
   * Whether the user is currently creating/joining a room.
   */
  const isJoining = ref(false);

  /**
   * Creates a new room.
   */
  const createRoom = (repository: string) => {
    return new Promise<RoomDto>((resolve) => {
      isJoining.value = true;

      socket.once("roomUpdate", (room) => {
        isJoining.value = false;
        resolve(room);
      });

      if (socket.connected) {
        socket.emit("createRoom", authStore.username, repository);
      } else {
        socket.connect();

        socket.once("connect", () => {
          socket.emit("createRoom", authStore.username, repository);
        });
      }
    });
  };

  /**
   * Joins the given room.
   */
  const joinRoom = (id: string) => {
    return new Promise<void>((resolve, reject) => {
      isJoining.value = true;

      socket.once("roomUpdate", () => {
        isJoining.value = false;
        resolve();
      });

      socket.once("disconnect", () => {
        isJoining.value = false;
        reject();
      });

      if (socket.connected) {
        socket.emit("join", id, authStore.username);
      } else {
        socket.connect();

        socket.once("connect", () => {
          socket.emit("join", id, authStore.username);
        });
      }
    });
  };

  /**
   * Selects the given story (only for the moderator).
   */
  const selectStory = (story: number) => {
    if (!room.value) return;
    socket.emit("selectStory", room.value.id, story);
  };

  /**
   * Selects the given estimation for the current user.
   */
  const estimate = (estimation: number) => {
    if (!room.value) return;
    socket.emit("estimate", room.value.id, estimation);
  };

  const endEstimation = () => {
    if (!room.value) return;
    socket.emit("endEstimation", room.value.id);
  };

  watch(
    () => authStore.username,
    (newName, oldName) => {
      if (!newName || !oldName || !room.value) return;
      socket.emit("changeName", room.value.id, oldName, newName);
    },
  );

  return {
    createRoom,
    isJoining,
    room,
    joinRoom,
    selectStory,
    estimate,
    endEstimation,
  };
});
