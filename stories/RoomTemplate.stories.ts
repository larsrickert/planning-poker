import type { StoryObj } from "@storybook/vue3";
import RoomTemplate from "~/components/RoomTemplate.vue";
import { Default as GitHubIssuesTableDefault } from "./GitHubIssuesTable.stories";

const meta = {
  title: "pages/Room",
  component: RoomTemplate,
};

export default meta;
type Story = StoryObj<typeof RoomTemplate>;

export const Default = {
  args: {
    currentUser: "larsrickert",
    room: {
      id: "room-1",
      repository: {
        name: "owner/repository",
        type: "github",
      },
      users: Array.from({ length: 8 }, (_, index) => ({
        id: index.toString(),
        username: index === 0 ? "larsrickert" : `User ${index + 1}`,
        avatar: index === 0 ? "https://github.com/larsrickert.png" : undefined,
      })),
      created: new Date().toISOString(),
      moderator: "0",
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
    room: {
      ...Default.args.room,
      users: Default.args.room.users.map((i, index) => ({
        ...i,
        estimation: index % 2 === 0 ? 42 : undefined,
      })),
      selectedStory: 4,
    },
  },
} satisfies Story;

export const RevealedEstimations = {
  args: {
    ...SelectedIssue.args,
    room: {
      ...SelectedIssue.args.room,
      averageEstimation: 42,
    },
  },
} satisfies Story;
