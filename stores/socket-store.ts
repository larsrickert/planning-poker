import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useSocketStore = defineStore("socket.io", () => {
  const socket = io({
    autoConnect: false,
  });

  /**
   * Whether the websocket is currently connected.
   */
  const isConnected = ref(false);

  socket.on("connect", () => (isConnected.value = true));
  socket.on("disconnect", () => (isConnected.value = false));

  /**
   * Connects to the websocket.
   */
  const connect = () => socket.connect();

  return { isConnected, connect };
});
