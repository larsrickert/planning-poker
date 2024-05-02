import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { StoryObj } from "@storybook/vue3";
import GitHubIssuesTable from "~/components/GitHubIssuesTable.vue";

const meta = {
  title: "components/GitHubIssuesTable",
  ...defineStorybookActionsAndVModels({
    component: GitHubIssuesTable,
    events: ["select"],
  }),
};

export default meta;
type Story = StoryObj<typeof GitHubIssuesTable>;

export const Default = {
  args: {
    issues: Array.from({ length: 100 }, (_, index) => {
      const id = index + 1;
      return {
        number: id,
        title: `Issue ${id}`,
        html_url: `https://example.com/${id}`,
        assignees: [
          { avatar_url: "https://picsum.phototos/100", login: "John Doe" },
          { avatar_url: "https://picsum.phototos/100", login: "Jane Doe" },
        ],
        body_html: "<p>HTML body...</p>",
        labels: [
          { name: "ux", color: "69CCAB", description: "Requires UX/UI design" },
          { name: "dev", color: "676A93", description: "Requires technical expertise" },
        ],
      };
    }),
  },
} satisfies Story;

export const Skeleton = {
  args: {
    issues: [],
    skeleton: true,
  },
} satisfies Story;

export const Empty = {
  args: {
    issues: [],
  },
} satisfies Story;
