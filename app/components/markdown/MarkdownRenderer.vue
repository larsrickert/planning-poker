<script lang="ts" setup>
import { OnyxMarkdown } from "@sit-onyx/comark";
import ProseInput from "./ProseInput.vue";

const props = defineProps<{
  markdown: string;
}>();

const components = {
  input: ProseInput,
};
</script>

<template>
  <OnyxMarkdown :value="props.markdown" :components />
</template>

<style lang="scss" scoped>
:deep(img + .onyx-external-link-icon) {
  display: none;
}
</style>
