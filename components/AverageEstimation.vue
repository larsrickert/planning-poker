<script lang="ts" setup>
import confetti from "canvas-confetti";
import type { User } from "~/server/types";

const props = defineProps<{
  estimation: number;
  /**
   * If all users voted for the same estimate, a confetti animation will be shown.
   */
  users?: User[];
}>();

const allEstimations = computed(() => {
  return (
    props.users
      ?.map(({ estimation }) => estimation)
      .filter((i): i is NonNullable<typeof i> => !!i) ?? []
  );
});

const shouldShowConfetti = computed(() => {
  return (
    allEstimations.value.length > 0 &&
    allEstimations.value.every((i) => i === allEstimations.value[0])
  );
});

/**
 * @see https://www.kirilv.com/canvas-confetti/#realistic
 */
const showConfetti = async (particleRatio: number, options: confetti.Options) => {
  await confetti({
    origin: { y: 0.7 },
    ...options,
    particleCount: Math.floor(200 * particleRatio),
    disableForReducedMotion: true,
  });
};

watchEffect(() => {
  if (!shouldShowConfetti.value) return;
  showConfetti(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  showConfetti(0.2, {
    spread: 60,
  });
  showConfetti(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  showConfetti(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  showConfetti(0.1, {
    spread: 120,
    startVelocity: 45,
  });
});
</script>

<template>
  <div>
    <OnyxHeadline is="h3" class="average"> {{ $t("room.estimation.average") }}: </OnyxHeadline>
    <span class="average__value">{{ props.estimation }}</span>
  </div>
</template>

<style lang="scss" scoped>
.average {
  &__value {
    font-size: 5rem;
    line-height: 5rem;
    font-weight: 600;
    color: var(--onyx-color-text-icons-neutral-soft);
  }
}
</style>
