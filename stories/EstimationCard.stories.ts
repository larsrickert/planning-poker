import type { Meta, StoryObj } from "@storybook/vue3";
import EstimationCard from "~/components/EstimationCard.vue";

const meta: Meta<typeof EstimationCard> = {
  title: "components/EstimationCard",
  component: EstimationCard,
};

export default meta;
type Story = StoryObj<typeof EstimationCard>;

export const Default = {
  args: {
    value: 42,
  },
} satisfies Story;

export const Selected = {
  args: {
    ...Default.args,
    selected: true,
  },
} satisfies Story;

export const Anonymous = {
  args: {
    ...Default.args,
    anonymous: true,
  },
} satisfies Story;
