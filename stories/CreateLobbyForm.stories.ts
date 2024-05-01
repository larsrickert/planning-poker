import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { StoryObj } from "@storybook/vue3";
import CreateLobbyForm from "~/components/CreateLobbyForm.vue";

const meta = {
  title: "components/CreateLobbyForm",
  ...defineStorybookActionsAndVModels({
    component: CreateLobbyForm,
    events: ["submit"],
  }),
};

export default meta;
type Story = StoryObj<typeof CreateLobbyForm>;

export const Default = { args: {} } satisfies Story;

export const Loading = {
  args: {
    loading: true,
  },
} satisfies Story;
