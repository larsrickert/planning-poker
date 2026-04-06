<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
  }>(),
  {
    src: "",
    alt: "",
  },
);
</script>

<template>
  <img :src="props.src" :alt="props.alt" />
</template>

<style lang="scss" scoped>
img {
  display: block;
  margin-block: var(--onyx-docs-density-paragraph);

  :deep(+ .onyx-external-link-icon) {
    display: none;
  }
}
</style>
