<script lang="ts" setup>
import { OnyxEmpty, OnyxLink } from "sit-onyx";
import type { GitHubIssue } from "~/types/github";
import type LobbyHeader from "./LobbyHeader.vue";

const props = withDefaults(
  defineProps<{
    /**
     * Currently lobby state.
     */
    lobby?: Lobby;
    /**
     * Role of the current user. Will determine which features are enabled.
     */
    role?: UserRole;
    /**
     * Whether the user is currently joining the lobby.
     */
    loading?: boolean;
    /**
     * Whether the issues are currently loading.
     */
    issuesLoading?: boolean;
    /**
     * List of GitHub issues. Will only be display if user is admin.
     */
    issues?: GitHubIssue[];
  }>(),
  {
    role: "user",
    issues: () => [],
  },
);

const emit = defineEmits<{
  selectIssue: [number: number];
}>();

const selectedIssue = computed(() => {
  return props.issues?.find((i) => i.number === props.lobby?.selectedIssue);
});
</script>

<template>
  <div class="lobby">
    <LobbyHeader
      class="lobby__header"
      :repository="props.lobby?.repository"
      :users="props.lobby?.users"
      :skeleton="props.loading"
    />

    <OnyxEmpty v-if="!props.loading && !props.lobby">
      <i18n-t keypath="lobby.notFound.text">
        <template #link>
          <OnyxLink href="/">{{ $t("lobby.notFound.link") }}</OnyxLink>
        </template>
      </i18n-t>
    </OnyxEmpty>

    <GitHubIssuesTable
      v-if="props.role === 'admin'"
      class="lobby__table"
      :issues="props.issues ?? []"
      :selected-issue="props.lobby?.selectedIssue"
      :skeleton="props.loading || props.issuesLoading"
      @select="emit('selectIssue', $event)"
    />

    <GitHubIssueBodyRenderer v-if="selectedIssue" :issue="selectedIssue" />
  </div>
</template>

<style lang="scss" scoped>
.lobby {
  &__header {
    margin-bottom: var(--onyx-spacing-md);
  }

  &__table {
    margin-bottom: var(--onyx-spacing-3xl);
  }
}
</style>
