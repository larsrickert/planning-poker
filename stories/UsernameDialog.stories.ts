import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { StoryObj } from "@storybook/vue3";
import UsernameDialog from "~/components/UsernameDialog.vue";

const meta = {
  title: "components/UsernameDialog",
  ...defineStorybookActionsAndVModels({
    component: UsernameDialog,
    events: ["update:modelValue"],
  }),
};

export default meta;
type Story = StoryObj<typeof UsernameDialog>;

export const Default = {
  args: {
    open: true,
  },
} satisfies Story;
