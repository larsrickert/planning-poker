<script lang="ts" setup>
const props = defineProps<{
  estimations: number[];
  disabled?: boolean;
}>();

const estimation = defineModel<number>();

const handleClick = (value: number) => {
  estimation.value = estimation.value === value ? undefined : value;
};
</script>

<template>
  <div class="estimations">
    <EstimationCard
      v-for="value in props.estimations"
      :key="value"
      :value
      :selected="estimation === value"
      :disabled="props.disabled"
      @click="handleClick(value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.estimations {
  display: flex;
  align-items: center;
  gap: var(--onyx-density-sm);
  flex-wrap: wrap;
}
</style>
