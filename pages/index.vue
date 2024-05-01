<script lang="ts" setup>
import { OnyxButton, OnyxHeadline } from "sit-onyx";

const socketStore = useSocketStore();
</script>

<template>
  <div>
    <OnyxHeadline is="h1">{{ $t("home.pageTitle") }}</OnyxHeadline>

    <p>Status: {{ socketStore.isConnected ? "connected" : "disconnected" }}</p>
    <OnyxButton label="Connect socket" @click="socketStore.connect" />
  </div>
</template>
