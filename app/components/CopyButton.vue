<script lang="ts" setup>
import { iconCheckSmall, iconCopy } from "@sit-onyx/icons";

const props = defineProps<{
  value: string;
}>();

const { copied, copy } = useClipboard();
</script>

<template>
  <OnyxIcon v-if="copied" :icon="iconCheckSmall" color="success" />
  <OnyxSystemButton v-else :label="$t('copy')" :icon="iconCopy" @click="copy(props.value)" />
</template>
