<script lang="ts" setup>
const attrs = useAttrs();

const data = computed(() => {
  return {
    type: (attrs.type as HTMLInputElement["type"] | undefined) || "text",
    label: (attrs["aria-label"] as string | undefined) ?? "",
    disabled: Boolean(attrs.disabled),
    checked: Boolean(attrs.checked),
  };
});
</script>

<template>
  <OnyxCheckbox
    v-if="data.type === 'checkbox'"
    class="checkbox"
    :label="data.label"
    value="value"
    :model-value="data.checked"
    :disabled="data.disabled"
    hide-label
  />

  <input v-else />
</template>

<style lang="scss" scoped>
.checkbox {
  display: inline-flex;
  vertical-align: middle;
  margin-right: var(--onyx-density-2xs);

  :deep(.onyx-checkbox__container) {
    --onyx-checkbox-input-padding: 0;
  }
}
</style>
