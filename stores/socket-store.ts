import { defineStore } from "pinia";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export type ServerToClientEvents = {
  lobbyUpdate: (lobby: Lobby) => void;
};

export type ClientToServerEvents = {
  createLobby: (data: CreateLobbyData) => void;
  joinLobby: (data: JoinLobbyData) => void;
  selectIssue: (lobbyId: string, issueNumber: number) => void;
  estimate: (lobbyId: string, username: string, estimation: number) => void;
};

export type Lobby = {
  /**
   * Unique lobby ID.
   */
  id: string;
  /**
   * Name of the (GitHub) repository.
   */
  repository: string;
  users: User[];
  selectedIssue?: number;
};

export type CreateLobbyData = Pick<Lobby, "repository"> & {
  username: string;
};

export type JoinLobbyData = Pick<Lobby, "id"> & {
  username: string;
};

export type User = {
  name: string;
  role: UserRole;
  estimation?: number;
};

export type UserRole = "admin" | "user";

export const useSocketStore = defineStore("socket.io", () => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
    autoConnect: false,
  });

  /**
   * Whether the websocket is currently connected.
   */
  const isConnected = ref(false);

  /**
   * Current lobby state.
   */
  const lobby = ref<Lobby>();

  /**
   * Current user name.
   */
  const username = ref("");

  // sync username with localStorage
  onMounted(() => {
    username.value = localStorage.getItem("username") ?? "";
    watch(username, (newValue) => {
      localStorage.setItem("username", newValue);
    });
  });

  socket.on("connect", () => (isConnected.value = true));
  socket.on("disconnect", () => (isConnected.value = false));
  socket.on("lobbyUpdate", (newLobby) => (lobby.value = newLobby));

  /**
   * Whether create lobby is currently loading.
   */
  const isJoiningLobby = ref(false);

  /**
   * Creates a new lobby.
   */
  const createLobby = (repository: string) => {
    return new Promise<Lobby>((resolve) => {
      isJoiningLobby.value = true;

      socket.once("lobbyUpdate", (lobby) => {
        isJoiningLobby.value = false;
        resolve(lobby);
      });

      const data: CreateLobbyData = { repository, username: username.value };

      if (socket.connected) {
        socket.emit("createLobby", data);
      } else {
        socket.connect();

        socket.once("connect", () => {
          socket.emit("createLobby", data);
        });
      }
    });
  };

  /**
   * Joins the given lobby.
   */
  const joinLobby = (id: string) => {
    return new Promise<void>((resolve, reject) => {
      if (lobby.value?.id === id) {
        resolve();
        return;
      }

      isJoiningLobby.value = true;

      socket.once("lobbyUpdate", () => {
        isJoiningLobby.value = false;
        resolve();
      });

      socket.once("disconnect", () => {
        isJoiningLobby.value = false;
        reject();
      });

      const data: JoinLobbyData = { id, username: username.value };

      if (socket.connected) {
        socket.emit("joinLobby", data);
      } else {
        socket.connect();

        socket.once("connect", () => {
          socket.emit("joinLobby", data);
        });
      }
    });
  };

  /**
   * Full lobby data for the current user.
   */
  const currentUser = computed(() => {
    return lobby.value?.users.find((i) => i.name === username.value);
  });

  /**
   * Selects the given GitHub issue (only for admins).
   */
  const selectIssue = (issueNumber: number) => {
    if (!lobby.value) return;
    socket.emit("selectIssue", lobby.value.id, issueNumber);
  };

  /**
   * Selects the given estimation for the current user.
   */
  const estimate = (estimation: number) => {
    if (!lobby.value) return;
    socket.emit("estimate", lobby.value.id, username.value, estimation);
  };

  return {
    isConnected,
    createLobby,
    isJoiningLobby,
    lobby,
    joinLobby,
    username,
    currentUser,
    selectIssue,
    estimate,
  };
});
