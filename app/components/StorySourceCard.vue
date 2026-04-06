<script lang="ts" setup>
import { iconCheckSmall } from "@sit-onyx/icons";
import type { OnyxButtonProps } from "sit-onyx";

const props = defineProps<{
  /**
   * Headline text.
   */
  headline: string;
  /**
   * Optional additional button props.
   */
  button?: Partial<OnyxButtonProps>;
  /**
   * Whether the data associated with the card is selected.
   */
  selected?: boolean;
}>();

defineSlots<{
  /**
   * Image/icon to display at the top.
   */
  image(): unknown;
  /**
   * Description text.
   */
  default(): unknown;
  /**
   * Optional slot to override the default select button.
   */
  button?(): unknown;
}>();

const emit = defineEmits<{
  /**
   * Emitted when the select button is clicked.
   */
  select: [];
}>();
</script>

<template>
  <OnyxCard class="card" :class="{ 'card--selected': props.selected }">
    <slot name="image"></slot>

    <OnyxHeadline is="h2">{{ props.headline }}</OnyxHeadline>

    <p class="text--medium">
      <slot></slot>
    </p>

    <OnyxButton
      class="card__button"
      :label="props.selected ? $t('selected') : $t('select')"
      :icon="props.selected ? iconCheckSmall : undefined"
      :mode="props.selected ? 'default' : 'outline'"
      v-bind="props.button"
      @click="emit('select')"
    />
  </OnyxCard>
</template>

<style lang="scss" scoped>
.card {
  --onyx-card-gap: var(--onyx-density-md);

  &--selected {
    border-color: var(--onyx-color-component-border-primary);
  }

  &__image {
    width: 100%;
  }

  &__button {
    width: 100%;
    margin-top: auto;
  }
}
</style>
