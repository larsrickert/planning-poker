import z from "zod";

const messageSchema = z.object({
  type: z.enum(["subscribe"]),
  sessionId: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HOOK_NAME = "ws:update_session" as any;

const removalHooks = new Map<string, () => void>();

export default defineWebSocketHandler({
  open(peer) {
    const removeHook = useNitroApp().hooks.hook(HOOK_NAME, (sessionId: string) => {
      const message = { type: "update", sessionId };

      // publish message to peer itself (does not include other connected peers)
      const isJoinedSession = peer.topics.has(sessionId);
      if (isJoinedSession) peer.send(message);

      // publish message to all other subscribed peers
      const firstPeer = peer.peers.values().next().value;
      firstPeer?.publish(sessionId, message);
    });

    removalHooks.set(peer.id, removeHook);
  },
  close(peer) {
    const removeHook = removalHooks.get(peer.id);
    removeHook?.();
    removalHooks.delete(peer.id);
  },
  message(peer, message) {
    const { data, error } = messageSchema.safeParse(message.json());
    if (error) return;
    if (data.type === "subscribe") peer.subscribe(data.sessionId);
  },
});

export const publishWebsocketSessionUpdate = (id: PlanningSession["id"]) => {
  useNitroApp().hooks.callHook(HOOK_NAME, id);
};
