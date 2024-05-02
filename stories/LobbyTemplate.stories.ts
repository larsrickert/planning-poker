import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { StoryObj } from "@storybook/vue3";
import LobbyTemplate from "~/components/LobbyTemplate.vue";
import { Default as GitHubIssuesTableDefault } from "./GitHubIssuesTable.stories";

const meta = {
  title: "pages/Lobby",
  ...defineStorybookActionsAndVModels({
    component: LobbyTemplate,
    events: ["selectIssue"],
  }),
};

export default meta;
type Story = StoryObj<typeof LobbyTemplate>;

export const Default = {
  args: {
    role: "admin",
    lobby: {
      id: "lobby-1",
      repository: "org/repository",
      users: Array.from({ length: 8 }, (_, index) => ({
        name: index === 0 ? "larsrickert" : `User ${index + 1}`,
        role: index === 0 ? "admin" : "user",
      })),
    },
    issues: GitHubIssuesTableDefault.args.issues,
  },
} satisfies Story;

export const Loading = {
  args: {
    ...Default.args,
    loading: true,
  },
} satisfies Story;

export const Empty = {
  args: {
    ...Default.args,
    lobby: undefined,
  },
} satisfies Story;
