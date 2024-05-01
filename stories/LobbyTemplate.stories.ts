import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { StoryObj } from "@storybook/vue3";
import LobbyTemplate from "~/components/LobbyTemplate.vue";

const meta = {
  title: "pages/Lobby",
  ...defineStorybookActionsAndVModels({
    component: LobbyTemplate,
    events: [],
  }),
};

export default meta;
type Story = StoryObj<typeof LobbyTemplate>;

export const Default = {
  args: {
    lobby: {
      id: "lobby-1",
      repository: "org/repository",
      users: Array.from({ length: 8 }, (_, index) => ({
        name: index === 0 ? "larsrickert" : `User ${index + 1}`,
        role: index === 0 ? "admin" : "user",
      })),
    },
  },
} satisfies Story;

export const Loading = {
  args: {
    loading: true,
  },
} satisfies Story;

export const Empty = { args: {} } satisfies Story;
