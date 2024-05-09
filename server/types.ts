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
  selectedStory?: number;
  /**
   * Average estimation of all users.
   * Will only be available after the estimation is ended.
   */
  averageEstimation?: number;
};

export type RoomEvents = {
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
  changeName: (oldName: string, newName: string) => void;
};

/**
 * A single planning poker room.
 */
export type Room = RoomDto & RoomEvents;

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
  estimation?: number;
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
} & Omit<RoomSocketEvents, "estimate">;

type RoomSocketEvents = {
  [K in keyof RoomEvents]: RoomEvents[K] extends (...a: infer U) => unknown
    ? (roomId: string, ...a: U) => void
    : never;
};
