<script lang="ts" setup>
const props = defineProps<{
  /**
   * Whether the estimation is selected.
   */
  selected?: boolean;
  value: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    class="estimation"
    :class="{ 'estimation--selected': props.selected }"
    :disabled="props.disabled"
    @click="emit('click')"
  >
    {{ value }}
  </button>
</template>

<style lang="scss" scoped>
.estimation {
  --estimation-background: var(--onyx-color-base-neutral-200);
  --estimation-background-hover: var(--onyx-color-base-neutral-300);
  --estimation-color: var(--onyx-color-text-icons-neutral-bold);
  border: none;
  border-radius: var(--onyx-radius-md);
  background-color: var(--estimation-background);
  color: var(--estimation-color);
  font-size: 1.5rem;
  box-sizing: border-box;
  width: 4rem;
  height: 6rem;
  font-weight: 600;

  &--selected {
    --estimation-background: var(--onyx-color-base-primary-200);
    --estimation-background-hover: var(--onyx-color-base-primary-300);
    --estimation-color: var(--onyx-color-text-icons-primary-bold);
  }

  &:enabled {
    cursor: pointer;

    &:focus-visible {
      outline: var(--onyx-outline-width) solid var(--onyx-color-component-focus-primary);
    }

    &:hover,
    &:focus-visible {
      background-color: var(--estimation-background-hover);
    }
  }

  &:disabled {
    background-color: var(--onyx-color-base-neutral-200);
    color: var(--onyx-color-text-icons-neutral-soft);
    cursor: not-allowed;
  }
}
</style>
