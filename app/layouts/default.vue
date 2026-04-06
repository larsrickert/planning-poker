<script lang="ts" setup>
const slots = defineSlots<{
  /**
   * Main page content.
   */
  default(): unknown;
  /**
   * Optional full width hero content at the top of the page.
   */
  hero?(): unknown;
  /**
   * Optional footer.
   */
  footer?(): unknown;
}>();
</script>

<template>
  <OnyxPageLayout :no-padding="!!slots.hero">
    <section v-if="slots.hero" class="hero">
      <div class="onyx-grid-layout">
        <slot name="hero"></slot>
      </div>
    </section>

    <div v-if="slots.hero" class="onyx-grid-layout">
      <slot></slot>
    </div>

    <slot v-else></slot>

    <template v-if="!!slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </OnyxPageLayout>
</template>

<style lang="scss" scoped>
.hero {
  background-color: var(--onyx-color-base-primary-100);
  border-bottom: var(--onyx-1px-in-rem) solid var(--onyx-color-base-primary-200);

  > .onyx-grid-layout {
    padding-block: var(--onyx-density-xl);
  }
}
</style>
