<script lang="ts" setup>
import { OnyxPageLayout } from "sit-onyx";
</script>

<template>
  <OnyxPageLayout>
    <slot />
  </OnyxPageLayout>
</template>

<style lang="scss">
.onyx-page__main {
  padding: var(--onyx-grid-margin);
  box-sizing: content-box;
  max-width: var(--onyx-grid-max-width);
  margin: 0 auto;
  width: 100%;
}
</style>
