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
      };
    }),
    repository: "org/repository",
  },
} satisfies Story;
