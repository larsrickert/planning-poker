import type { StoryObj } from "@storybook/vue3";
import GitHubIssueBodyRenderer from "~/components/GitHubIssueBodyRenderer.vue";

const meta = {
  title: "components/GitHubIssueBodyRenderer",
  component: GitHubIssueBodyRenderer,
};

export default meta;
type Story = StoryObj<typeof GitHubIssueBodyRenderer>;

export const Default = {
  args: {
    issue: {
      number: 42,
      title: "Issue title",
      assignees: [],
      html_url: "https://github.com/owner/repository/issues/42",
      labels: [],
      body_html: `
      <h1>Headline</h1>
      <h2>Headline</h2>
      <h3>Headline</h3>
      <h4>Headline</h4>
      <h5>Headline</h5>
      <h6>Headline</h6>
      <a href="https://example.com">Test link</a>
      `,
    },
  },
} satisfies Story;
