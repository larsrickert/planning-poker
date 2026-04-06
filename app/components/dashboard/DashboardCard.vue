<script lang="ts" setup>
const props = defineProps<{
  headline: string;
  description: string;
}>();

const slots = defineSlots<{
  default?(): unknown;
}>();
</script>

<template>
  <OnyxCard class="card">
    <OnyxHeadline is="h3">{{ props.headline }}</OnyxHeadline>
    <p class="text--medium">{{ props.description }}</p>

    <div v-if="slots.default" class="card__actions">
      <slot></slot>
    </div>
  </OnyxCard>
</template>

<style lang="scss" scoped>
.card {
  &__actions {
    margin-top: auto;
  }
}
</style>
