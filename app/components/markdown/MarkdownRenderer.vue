<script lang="ts" setup>
import { OnyxMarkdownRenderer } from "@sit-onyx/mdc";

const props = defineProps<{
  markdown: string;
}>();
</script>

<template>
  <ClientOnly>
    <OnyxMarkdownRenderer :markdown="props.markdown" />
  </ClientOnly>
</template>
