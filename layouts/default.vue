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
  max-width: var(--onyx-grid-max-width);
  margin-inline: var(--onyx-grid-margin-inline);
}
</style>
