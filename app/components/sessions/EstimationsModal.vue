<script lang="ts" setup>
const props = defineProps<{
  users?: EnrichedUser[];
}>();

const open = defineModel<boolean>("open");

const estimations = computed(() => {
  const values = props.users?.map((user) => user.estimation) ?? [];

  // if not all votes are revealed, return empty array
  const allRevealed = !values.some((value) => typeof value === "boolean");
  if (!allRevealed) return [];

  return values.filter((value) => typeof value === "number");
});

const averageEstimation = computed(() => {
  if (!estimations.value.length) return 0;
  const sum = estimations.value.reduce((total, value) => total + value, 0);
  const total = sum / estimations.value.length;
  return Math.round(total * 100) / 100;
});

const isPerfectEstimation = computed(() => {
  if (!estimations.value.length) return false;
  return estimations.value.every((value) => value === averageEstimation.value);
});

onMounted(() => {
  watchEffect(() => {
    if (!isPerfectEstimation.value || !open.value) return;
    showConfetti();
  });
});
</script>

<template>
  <OnyxModal v-model:open="open" class="modal" :label="$t('estimations.estimation', 2)">
    <div class="modal__content">
      <p>{{ $t("estimations.average") }}</p>
      <div class="modal__estimation">{{ averageEstimation }}</div>
    </div>

    <template #footer>
      <OnyxBottomBar>
        <OnyxButton :label="$t('close')" color="neutral" mode="plain" @click="open = false" />
      </OnyxBottomBar>
    </template>
  </OnyxModal>
</template>

<style lang="scss" scoped>
.modal {
  width: 24rem;
  container-type: inline-size;

  &__content {
    padding: var(--onyx-density-xl) var(--onyx-modal-padding-inline);
    display: flex;
    flex-direction: column;
    gap: var(--onyx-density-sm);
  }

  &__estimation {
    font-size: 4rem;
    line-height: 4rem;
    font-weight: var(--onyx-font-weight-semibold);
  }
}
</style>
