<script lang="ts" setup>
import {
  OnyxAvatar,
  OnyxEmpty,
  OnyxHeadline,
  OnyxLink,
  OnyxLoadingIndicator,
  OnyxTooltip,
} from "sit-onyx";
import type { GitHubIssue } from "~/types/github";

const props = defineProps<{
  /**
   * Role of the current user. Will determine which features are enabled.
   */
  role: UserRole;
  lobby?: Lobby;
  /**
   * Whether the user is currently joining the lobby.
   */
  loading?: boolean;
  /**
   * List of GitHub issues. Will only be display if user is admin.
   */
  issues?: GitHubIssue[];
}>();

const emit = defineEmits<{
  selectIssue: [number: number];
}>();

const selectedIssue = computed(() => {
  return props.issues?.find((i) => i.number === props.lobby?.selectedIssue);
});
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
      <div class="lobby__header">
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
      </div>

      <GitHubIssuesTable
        v-if="props.role === 'admin'"
        class="lobby__table"
        :issues="props.issues ?? []"
        :repository="props.lobby.repository"
        :selected-issue="props.lobby.selectedIssue"
        @select="emit('selectIssue', $event)"
      />

      <GitHubIssueBodyRenderer v-if="selectedIssue" :issue="selectedIssue" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.lobby {
  &__header {
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-lg);
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--onyx-spacing-md);
  }

  &__repository {
    color: var(--onyx-color-text-icons-neutral-soft);
  }

  &__users {
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-3xs);
  }

  &__table {
    margin-bottom: var(--onyx-spacing-3xl);
  }
}
</style>
