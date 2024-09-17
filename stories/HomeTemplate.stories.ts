import type { StoryObj } from "@storybook/vue3";
import HomeTemplate from "~/components/HomeTemplate.vue";

const meta = {
  title: "pages/Home",
  component: HomeTemplate,
};

export default meta;
type Story = StoryObj<typeof HomeTemplate>;

export const Default = { args: {} } satisfies Story;

export const Loading = {
  args: {
    loading: true,
  },
} satisfies Story;
