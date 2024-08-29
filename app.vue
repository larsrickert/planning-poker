<script lang="ts" setup>
import githubLogo from "@/assets/images/github-logo.svg?raw";
import spade from "@/assets/images/spade.svg?raw";
import userEdit from "@sit-onyx/icons/user-edit.svg?raw";
import { createToastProvider, TOAST_PROVIDER_INJECTION_KEY, type ColorSchemeValue } from "sit-onyx";
import { version } from "./package.json";

const authStore = useAuthStore();
const { t } = useI18n();

const isUsernameDialogOpen = ref(false);

const openLink = (href: string) => {
  window.open(href, "_blank");
};

provide(TOAST_PROVIDER_INJECTION_KEY, createToastProvider());
</script>

<template>
  <OnyxAppLayout class="onyx-grid-max-md onyx-grid-center">
    <template #navBar>
      <OnyxNavBar @app-area-click="$router.push('/')">
        <template #appArea>
          <OnyxIcon :icon="spade" />
          {{ $t("appName") }}
        </template>

        <template v-if="authStore.username" #contextArea>
          <ClientOnly>
            <OnyxUserMenu :username="authStore.username" :avatar="authStore.avatar">
              <OnyxColorSchemeMenuItem v-model="$colorMode.preference as ColorSchemeValue" />

              <OnyxMenuItem @click="isUsernameDialogOpen = true">
                <OnyxIcon :icon="userEdit" />
                {{ t("username.change") }}
              </OnyxMenuItem>

              <OnyxMenuItem @click="openLink('https://github.com/larsrickert/planning-poker')">
                <OnyxIcon :icon="githubLogo" />
                {{ t("github") }}
              </OnyxMenuItem>

              <template #footer>
                {{ $t("appVersion") }}
                <span class="onyx-text--monospace">{{ version }}</span>
              </template>
            </OnyxUserMenu>
          </ClientOnly>
        </template>
      </OnyxNavBar>
    </template>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UsernameDialog
      v-model="authStore.username"
      :open="!authStore.username || isUsernameDialogOpen"
      @update:model-value="isUsernameDialogOpen = false"
    />

    <OnyxToast />
  </OnyxAppLayout>
</template>
