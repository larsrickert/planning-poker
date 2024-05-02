import { defineStorybookActionsAndVModels } from "@sit-onyx/storybook-utils";
import type { Meta, StoryObj } from "@storybook/vue3";
import LobbyHeader from "~/components/LobbyHeader.vue";

const meta: Meta<typeof LobbyHeader> = {
  title: "components/LobbyHeader",
  ...defineStorybookActionsAndVModels({
    component: LobbyHeader,
    events: [],
  }),
};

export default meta;
type Story = StoryObj<typeof LobbyHeader>;

export const Default = {
  args: {
    repository: "owner/repository",
    users: Array.from({ length: 8 }, (_, index) => ({
      name: index === 0 ? "larsrickert" : `User ${index + 1}`,
      role: index === 0 ? "admin" : "user",
    })),
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
    users: Default.args.users.map((i, index) => ({
      ...i,
      estimation: index % 2 === 0 ? 42 : undefined,
    })),
  },
} satisfies Story;

export const ShowEstimations = {
  args: {
    ...Estimated.args,
    showEstimations: true,
  },
} satisfies Story;
