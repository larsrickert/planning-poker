import { useLocalStorage } from "@vueuse/core";

export const useAuthStore = defineStore("auth", () => {
  /**
   * Current username. Will be synched with the localStorage.
   */
  const username = useLocalStorage("username", "", {
    writeDefaults: false,
    initOnMounted: true,
  });

  return { username };
});
