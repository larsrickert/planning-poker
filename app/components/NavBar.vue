<script lang="ts" setup>
import logo from "~/assets/images/logo.svg?raw";
</script>

<template>
  <OnyxNavBar>
    <template #appArea>
      <OnyxIcon :icon="logo" />
      {{ $t("app.name") }}
    </template>

    <OnyxNavItem :label="$t('dashboard')" :link="$localePath('/')" />

    <template #contextArea>
      <UserMenu />
    </template>
  </OnyxNavBar>
</template>
