import type { Room, User } from "./types";

/**
 * Creates a new planning poker room.
 *
 * @param moderator Username of the moderator.
 */
export const createRoom = (moderatorName: string, repositoryName: string) => {
  const moderator = createUser(moderatorName);
  let users = [moderator];

  const room: Room = {
    id: crypto.randomUUID(),
    created: new Date().toISOString(),
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
      users = users.map((user) => ({ ...user, estimation: undefined }));
      delete room.averageEstimation;
    },
    estimate: (userId, estimation) => {
      const index = users.findIndex((user) => user.id === userId);
      if (index === -1) return;
      users[index].estimation = estimation;
    },
    endEstimation: () => {
      const estimations = users
        .map((user) => user.estimation)
        .filter((i): i is NonNullable<typeof i> => !!i);

      const average =
        estimations.reduce((sum, estimation) => sum + estimation, 0) / (estimations.length || 1);

      room.averageEstimation = Math.round(average * 10) / 10;
    },
    changeName: (oldName, newName) => {
      const index = users.findIndex(({ username }) => username === oldName);
      if (index === -1) return;
      users[index] = {
        ...createUser(newName),
        id: users[index].id,
      };
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
