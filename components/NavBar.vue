<script lang="ts" setup>
import githubLogo from "@/assets/images/github-logo.svg?raw";
import spade from "@/assets/images/spade.svg?raw";
import userEdit from "@sit-onyx/icons/user-edit.svg?raw";
import type { ColorSchemeValue } from "sit-onyx";
import { version } from "../package.json";

const props = defineProps<{
  username?: string;
  avatar?: string;
}>();

const emit = defineEmits<{
  changeUsername: [];
}>();
</script>

<template>
  <OnyxNavBar>
    <template #appArea>
      <OnyxIcon :icon="spade" />
      {{ $t("appName") }}
    </template>

    <template v-if="props.username" #contextArea>
      <ClientOnly>
        <OnyxUserMenu :full-name="props.username" :avatar="props.avatar">
          <OnyxColorSchemeMenuItem v-model="$colorMode.preference as ColorSchemeValue" />

          <OnyxMenuItem @click="emit('changeUsername')">
            <OnyxIcon :icon="userEdit" />
            {{ $t("username.change") }}
          </OnyxMenuItem>

          <OnyxMenuItem href="https://github.com/larsrickert/planning-poker">
            <OnyxIcon :icon="githubLogo" />
            {{ $t("github") }}
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
