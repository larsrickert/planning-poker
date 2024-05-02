import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { Meta, StoryObj } from "@storybook/vue3";
import RoomHeader from "~/components/RoomHeader.vue";
import { Default as RoomTemplateDefault } from "./RoomTemplate.stories";

const meta: Meta<typeof RoomHeader> = {
  title: "components/RoomHeader",
  ...defineStorybookActionsAndVModels({
    component: RoomHeader,
    events: [],
  }),
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
      estimations: {
        "1": 42,
        "3": 12,
        "5": 4,
      },
    },
  },
} satisfies Story;

export const ShowEstimations = {
  args: {
    ...Estimated.args,
    room: {
      ...Estimated.args.room,
      averageEstimation: 19.3,
    },
  },
} satisfies Story;
