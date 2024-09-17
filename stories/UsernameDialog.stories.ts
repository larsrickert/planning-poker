import type { StoryObj } from "@storybook/vue3";
import UsernameDialog from "~/components/UsernameDialog.vue";

const meta = {
  title: "components/UsernameDialog",
  component: UsernameDialog,
};

export default meta;
type Story = StoryObj<typeof UsernameDialog>;

export const Default = {
  args: {
    open: true,
  },
} satisfies Story;
