import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { StoryObj } from "@storybook/vue3";
import AppDialog from "~/components/AppDialog.vue";

const meta = {
  title: "components/AppDialog",
  ...defineStorybookActionsAndVModels({
    component: AppDialog,
    events: [],
    render: (args) => ({
      setup: () => ({ args }),
      components: { AppDialog },
      template: `<AppDialog v-bind="args"> Slot content... </AppDialog>`,
    }),
  }),
};

export default meta;
type Story = StoryObj<typeof AppDialog>;

export const Default = {
  args: {
    open: true,
  },
} satisfies Story;
