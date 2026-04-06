<script lang="ts" setup>
const { t } = useI18n();

useHead({
  titleTemplate: (title) => {
    const appName = t("app.name");
    return title ? `${title} | ${appName}` : appName;
  },
});
</script>

<template>
  <OnyxAppLayout class="onyx-grid-max-md onyx-grid-center">
    <template #navBar>
      <NavBar />
    </template>

    <NuxtLayout>
      <NuxtRouteAnnouncer />

      <!-- using a slot here so we can re-use the App for the error.vue page -->
      <slot>
        <NuxtPage />
      </slot>
    </NuxtLayout>
  </OnyxAppLayout>
</template>
