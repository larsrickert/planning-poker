<script lang="ts" setup>
import check from "@sit-onyx/icons/check.svg?raw";
import { OnyxAvatar, OnyxHeadline, OnyxIcon, OnyxSkeleton, OnyxTooltip } from "sit-onyx";
import type { User } from "../stores/socket-store";

const props = withDefaults(
  defineProps<{
    repository?: string;
    skeleton?: boolean;
    users?: User[];
  }>(),
  {
    repository: "N/A",
    users: () => [],
  },
);
</script>

<template>
  <div class="header">
    <OnyxHeadline is="h2">
      {{ $t("lobby.headline") }}:

      <OnyxSkeleton v-if="props.skeleton" class="header__repository--skeleton" />
      <span v-else class="header__repository">{{ props.repository }}</span>
    </OnyxHeadline>

    <div class="header__users">
      <template v-if="props.skeleton">
        <OnyxSkeleton v-for="i in 3" :key="i" class="avatar-skeleton" />
      </template>

      <ClientOnly v-else>
        <OnyxTooltip
          v-for="user of props.users"
          :key="user.name"
          :text="user.name"
          position="bottom"
          class="avatar"
        >
          <div v-if="user.estimation != undefined" class="avatar__overlay">
            <OnyxIcon :icon="check" />
          </div>
          <OnyxAvatar :src="`https://github.com/${user.name}.png`" :label="user.name" />
        </OnyxTooltip>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--onyx-spacing-lg);
  align-items: center;
  justify-content: space-between;

  &__repository {
    color: var(--onyx-color-text-icons-neutral-soft);

    &--skeleton {
      width: 6rem;
      height: 1.25rem;
      display: inline-block;
      vertical-align: middle;
    }
  }

  &__users {
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-3xs);
  }
}

.avatar-skeleton {
  width: 3rem;
  height: 3rem;
  border-radius: var(--onyx-radius-full);
}

.avatar {
  position: relative;

  &__overlay {
    position: absolute;
    left: 0;
    top: 0;
    background-color: color-mix(in srgb, var(--onyx-color-base-success-500), transparent 20%);
    width: 100%;
    height: 100%;
    border-radius: var(--onyx-radius-full);

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
