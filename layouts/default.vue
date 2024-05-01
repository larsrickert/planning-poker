<script lang="ts" setup>
import { OnyxPageLayout } from "sit-onyx";
</script>

<template>
  <OnyxPageLayout>
    <div class="page">
      <slot />
    </div>
  </OnyxPageLayout>
</template>

<style lang="scss">
.page {
  padding: var(--onyx-grid-margin);
  box-sizing: content-box;
  max-width: var(--onyx-grid-max-width);
  margin: 0 auto;
}
</style>
