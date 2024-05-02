<script lang="ts" setup>
const props = defineProps<{
  /**
   * Whether to hide the estimation.
   */
  anonymous?: boolean;
  /**
   * Whether the estimation is selected.
   */
  selected?: boolean;
  value?: number;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    class="estimation"
    :class="{ 'estimation--selected': props.selected }"
    @click="emit('click')"
  >
    {{ value == undefined || props.anonymous ? "?" : value }}
  </button>
</template>

<style lang="scss" scoped>
.estimation {
  border: none;
  border-radius: var(--onyx-radius-md);
  background-color: var(--onyx-color-base-neutral-200);
  color: var(--onyx-color-text-icons-neutral-bold);
  font-size: 1.5rem;
  box-sizing: border-box;
  width: 4rem;
  height: 6rem;
  font-weight: 600;
  cursor: pointer;

  &:focus-visible {
    outline: 0.25rem solid var(--onyx-color-base-primary-200);
  }

  &:hover,
  &:focus-visible {
    background-color: var(--onyx-color-base-neutral-300);
  }

  &--selected {
    background-color: var(--onyx-color-base-primary-200);
    color: var(--onyx-color-text-icons-primary-bold);

    &:hover,
    &:focus-visible {
      background-color: var(--onyx-color-base-primary-300);
    }
  }
}
</style>
