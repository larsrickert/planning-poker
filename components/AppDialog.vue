<script lang="ts" setup>
import { ref, watchEffect } from "vue";

const props = defineProps<{
  /**
   * Whether the modal is open.
   */
  open?: boolean;
}>();

const dialogRef = ref<HTMLDialogElement>();

watchEffect(() => {
  if (props.open) dialogRef.value?.showModal();
  else dialogRef.value?.close();
});
</script>

<template>
  <dialog ref="dialogRef" class="dialog" @cancel.prevent>
    <slot v-if="props.open" />
  </dialog>
</template>

<style lang="scss" scoped>
.dialog {
  border: none;
  outline: none;
  border-radius: var(--onyx-radius-md);
  background-color: var(--onyx-color-base-background-blank);
  margin: auto;
  color: var(--onyx-color-text-icons-neutral-intense);
  padding: var(--onyx-spacing-md);

  &::backdrop {
    background-color: color-mix(in srgb, var(--onyx-color-base-neutral-300), transparent 30%);
  }
}
</style>
