<script lang="ts" setup>
import githubLogo from "@/assets/images/github-logo.svg?raw";
import spade from "@/assets/images/spade.svg?raw";
import moon from "@sit-onyx/icons/moon.svg?raw";
import sunny from "@sit-onyx/icons/sunny.svg?raw";
import userEdit from "@sit-onyx/icons/user-edit.svg?raw";
import type { SelectOption } from "sit-onyx";
import { version } from "./package.json";

const authStore = useAuthStore();
const { t } = useI18n();

const isDialogOpen = ref(false);
const colorMode = useColorMode();

const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (value) => (colorMode.preference = value ? "dark" : "light"),
});

const userMenuOptions = computed(() => {
  return [
    { label: t("toggleDarkMode"), value: "dark-mode", icon: isDark.value ? moon : sunny },
    { label: t("username.change"), value: "username", icon: userEdit },
    { label: t("github"), value: "github", icon: githubLogo },
  ] satisfies SelectOption[];
});

const handleOptionClick = (value: string) => {
  if (value === "dark-mode") isDark.value = !isDark.value;
  else if (value === "username") isDialogOpen.value = true;
  else if (value === "github") {
    window.open("https://github.com/larsrickert/planning-poker", "_blank");
  }
};
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
            <OnyxUserMenu
              :username="authStore.username"
              :options="userMenuOptions"
              :avatar="authStore.avatar"
              @option-click="handleOptionClick($event)"
            >
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
      :open="!authStore.username || isDialogOpen"
      @update:model-value="isDialogOpen = false"
    />
  </OnyxAppLayout>
</template>
