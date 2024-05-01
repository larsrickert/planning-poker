<script lang="ts" setup>
import settings from "@sit-onyx/icons/settings.svg?raw";
import { OnyxAppLayout, OnyxHeadline, OnyxIconButton, OnyxTooltip } from "sit-onyx";

const socketStore = useSocketStore();
const isDialogOpen = ref(false);
</script>

<template>
  <OnyxAppLayout class="onyx-grid-max-md">
    <NuxtLayout>
      <div class="app-name">
        <OnyxHeadline is="h1">{{ $t("appName") }}</OnyxHeadline>
        <OnyxTooltip :text="$t('username.change')" position="bottom">
          <OnyxIconButton
            :label="$t('username.change')"
            :icon="settings"
            variation="secondary"
            @click="isDialogOpen = true"
          />
        </OnyxTooltip>
      </div>

      <UsernameDialog
        v-if="!socketStore.username || isDialogOpen"
        v-model="socketStore.username"
        @update:model-value="isDialogOpen = false"
      />
      <NuxtPage v-else />
    </NuxtLayout>
  </OnyxAppLayout>
</template>

<style lang="scss" scoped>
.app-name {
  margin-bottom: var(--onyx-spacing-xl);
  display: flex;
  align-items: center;
  gap: var(--onyx-spacing-xs);
}
</style>
