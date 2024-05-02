import type { Room, User } from "./types";

/**
 * Creates a new planning poker room.
 *
 * @param moderator Username of the moderator.
 */
export const createRoom = (moderatorName: string, repositoryName: string) => {
  const moderator = createUser(moderatorName);
  const users = [moderator];

  const room: Room = {
    id: crypto.randomUUID(),
    created: new Date().toISOString(),
    estimations: {},
    moderator: moderator.id,
    repository: {
      name: repositoryName,
      type: "github",
    },
    get users() {
      return users;
    },
    join: (username) => {
      const existingUser = users.find((user) => user.username === username);
      if (existingUser) return existingUser;

      const newUser = createUser(username);
      users.push(newUser);
      return newUser;
    },
    selectStory: (story) => {
      room.selectedStory = story;
      room.estimations = {};
      delete room.averageEstimation;
    },
    estimate: (userId, estimation) => {
      room.estimations[userId] = estimation;
    },
    endEstimation: () => {
      const average =
        Object.values(room.estimations).reduce((sum, estimation) => sum + estimation, 0) /
          Object.values(room.estimations).length || 1;

      room.averageEstimation = Math.round(average * 10) / 10;
    },
  };

  return room;
};

/**
 * Creates a new user.
 */
const createUser = (username: string): User => {
  return {
    id: crypto.randomUUID(),
    username,
    avatar: `https://github.com/${username}.png`,
  };
};
