<script lang="ts" setup>
import {
  OnyxAvatar,
  OnyxEmpty,
  OnyxHeadline,
  OnyxLink,
  OnyxLoadingIndicator,
  OnyxTooltip,
} from "sit-onyx";

const props = defineProps<{
  lobby?: Lobby;
  /**
   * Whether the user is currently joining the lobby.
   */
  loading?: boolean;
}>();
</script>

<template>
  <div class="lobby">
    <OnyxLoadingIndicator v-if="props.loading" />

    <OnyxEmpty v-else-if="!props.lobby">
      <i18n-t keypath="lobby.notFound.text">
        <template #link>
          <OnyxLink href="/">{{ $t("lobby.notFound.link") }}</OnyxLink>
        </template>
      </i18n-t>
    </OnyxEmpty>

    <template v-else>
      <OnyxHeadline is="h2">
        Planning poker for:
        <span class="lobby__repository">{{ props.lobby.repository }}</span>
      </OnyxHeadline>

      <div class="lobby__users">
        <OnyxTooltip
          v-for="user of props.lobby.users"
          :key="user.name"
          :text="user.name"
          position="bottom"
        >
          <OnyxAvatar :src="`https://github.com/${user.name}.png`" :label="user.name" />
        </OnyxTooltip>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.lobby {
  &__repository {
    color: var(--onyx-color-text-icons-neutral-soft);
  }

  &__users {
    margin-top: var(--onyx-spacing-md);
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-3xs);
  }
}
</style>
