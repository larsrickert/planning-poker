<script lang="ts" setup>
import settings from "@sit-onyx/icons/settings.svg?raw";
import { OnyxAppLayout, OnyxHeadline, OnyxIconButton, OnyxSwitch, OnyxTooltip } from "sit-onyx";

const authStore = useAuthStore();

const isDialogOpen = ref(false);
const colorMode = useColorMode();

const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (value) => (colorMode.preference = value ? "dark" : "light"),
});
</script>

<template>
  <OnyxAppLayout class="onyx-grid-max-md">
    <template #navBar>
      <header class="header">
        <OnyxHeadline is="h1">{{ $t("appName") }}</OnyxHeadline>

        <div class="header__actions">
          <ClientOnly>
            <OnyxSwitch v-model="isDark" :label="$t('darkMode')" />

            <OnyxTooltip :text="$t('username.change')" position="bottom">
              <OnyxIconButton
                :label="$t('username.change')"
                :icon="settings"
                variation="secondary"
                @click="isDialogOpen = true"
              />
            </OnyxTooltip>
          </ClientOnly>
        </div>
      </header>
    </template>

    <NuxtLayout>
      <UsernameDialog
        v-if="!authStore.username || isDialogOpen"
        v-model="authStore.username"
        @update:model-value="isDialogOpen = false"
      />
      <NuxtPage />
    </NuxtLayout>
  </OnyxAppLayout>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--onyx-spacing-xs);

  padding: var(--onyx-spacing-md);
  box-sizing: content-box;
  max-width: var(--onyx-grid-max-width);
  margin: 0 auto;

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-lg);
    align-items: center;
  }
}
</style>
