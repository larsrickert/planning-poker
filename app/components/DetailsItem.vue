<script lang="ts" setup>
const props = defineProps<{
  label: string;
  skeleton?: boolean;
}>();

defineSlots<{
  default(): unknown;
}>();
</script>

<template>
  <div class="item">
    <div class="item__label onyx-text--small">{{ props.label }}</div>

    <div class="item__value">
      <OnyxSkeleton v-if="props.skeleton" class="item__skeleton" />
      <slot v-else></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  gap: var(--onyx-density-3xs);

  &__label {
    color: var(--onyx-color-text-icons-neutral-medium);
  }

  &__value {
    display: flex;
    align-items: center;
    gap: var(--onyx-density-xs);
  }

  &__skeleton {
    height: 1lh;
    width: var(--onyx-density-3xl);
    max-width: 100%;
  }
}
</style>
