import type { createRoom } from "./rooms";

/**
 * A single planning poker room as it is shared with the frontend.
 */
export type RoomDto = {
  /**
   * Unique room ID.
   */
  id: string;
  /**
   * ISO timestamp when the room was created.
   */
  created: string;
  /**
   * Git repository details.
   */
  repository: Repository;
  /**
   * List of joined users.
   */
  users: User[];
  /**
   * ID of the moderator.
   */
  moderator: string;
  /**
   * Map of user estimations. Will only be available
   * if the moderator has ended the estimation.
   * key = user ID, value = estimation
   */
  estimations: Record<string, number>;
  selectedStory?: number;
  /**
   * Average estimation of all users.
   * Will only be available after the estimation is ended.
   */
  averageEstimation?: number;
};

/**
 * A single planning poker room.
 */
export type Room = RoomDto & {
  /**
   * Creates and joins a new user.
   * If user is already joined, he will be returned and not be joined twice.
   */
  join: (username: string) => User;
  /**
   * Selects the given story.
   */
  selectStory: (story: number) => void;
  /**
   * Selects the given estimation for the given user.
   */
  estimate: (userId: string, estimation: number) => void;
  /**
   * Ends the estimation session for the current story.
   */
  endEstimation: () => void;
};

export type Repository = {
  /**
   * Full repository name.
   *
   * @example "larsrickert/planning-poker".
   */
  name: string;
  /**
   * Repository type. Currently only GitHub is supported but
   * we might support more types in the future.
   */
  type: "github";
};

export type User = {
  id: string;
  username: string;
  avatar?: string;
};

export type ServerToClientEvents = {
  /**
   * Emitted to all users when the current room data is updated.
   */
  roomUpdate: (room: Room) => void;
};

export type ClientToServerEvents = {
  createRoom: (...args: Parameters<typeof createRoom>) => void;
  estimate: (roomId: string, estimation: number) => void;
} & RoomEvents;

type RoomEvents<T = Pick<Room, "join" | "selectStory" | "endEstimation">> = {
  [K in keyof T]: T[K] extends (...a: infer U) => unknown
    ? (roomId: string, ...a: U) => void
    : never;
};
