import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { StoryObj } from "@storybook/vue3";
import LobbyTemplate from "~/components/LobbyTemplate.vue";
import { Default as GitHubIssuesTableDefault } from "./GitHubIssuesTable.stories";

const meta = {
  title: "pages/Lobby",
  ...defineStorybookActionsAndVModels({
    component: LobbyTemplate,
    events: ["selectIssue", "estimate", "revealEstimations"],
  }),
};

export default meta;
type Story = StoryObj<typeof LobbyTemplate>;

export const Default = {
  args: {
    currentUser: "larsrickert",
    lobby: {
      id: "lobby-1",
      repository: "owner/repository",
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

export const IssuesLoading = {
  args: {
    ...Default.args,
    issuesLoading: true,
  },
} satisfies Story;

export const Empty = { args: {} } satisfies Story;

export const SelectedIssue = {
  args: {
    ...Default.args,
    lobby: {
      ...Default.args.lobby,
      users: Default.args.lobby.users.map((i, index) => ({
        ...i,
        estimation: index % 2 === 0 ? 42 : undefined,
      })),
      selectedIssue: 4,
    },
  },
} satisfies Story;

export const RevealedEstimations = {
  args: {
    ...SelectedIssue.args,
    lobby: {
      ...SelectedIssue.args.lobby,
      averageEstimation: 42,
    },
  },
} satisfies Story;
