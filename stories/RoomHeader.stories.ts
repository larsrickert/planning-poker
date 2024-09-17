import type { Meta, StoryObj } from "@storybook/vue3";
import RoomHeader from "~/components/RoomHeader.vue";
import { Default as RoomTemplateDefault } from "./RoomTemplate.stories";

const meta: Meta<typeof RoomHeader> = {
  title: "components/RoomHeader",
  component: RoomHeader,
};

export default meta;
type Story = StoryObj<typeof RoomHeader>;

export const Default = {
  args: {
    room: RoomTemplateDefault.args.room,
  },
} satisfies Story;

export const Skeleton = {
  args: {
    skeleton: true,
  },
} satisfies Story;

export const Estimated = {
  args: {
    ...Default.args,
    room: {
      ...Default.args.room,
      users: Default.args.room.users.map((user) => ({ ...user, estimation: 42 })),
    },
  },
} satisfies Story;

export const ShowEstimations = {
  args: {
    ...Estimated.args,
    room: {
      ...Estimated.args.room,
      averageEstimation: 42,
    },
  },
} satisfies Story;
