import type { StoryObj } from "@storybook/vue3";
import CreateRoomForm from "~/components/CreateRoomForm.vue";

const meta = {
  title: "components/CreateRoomForm",
  component: CreateRoomForm,
};

export default meta;
type Story = StoryObj<typeof CreateRoomForm>;

export const Default = { args: {} } satisfies Story;

export const Loading = {
  args: {
    loading: true,
  },
} satisfies Story;
