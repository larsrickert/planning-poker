<script lang="ts" setup>
import { OnyxEmpty, OnyxHeadline, OnyxLink } from "sit-onyx";
import type { GitHubIssue } from "~/types/github";
import EstimationCard from "./EstimationCard.vue";
import type LobbyHeader from "./LobbyHeader.vue";

const AVAILABLE_ESTIMATIONS = [1, 2, 3, 5, 8, 13] as const;

const props = withDefaults(
  defineProps<{
    /**
     * Currently lobby state.
     */
    lobby?: Lobby;
    /**
     * Current username. Will determine which features are enabled based on the user role.
     */
    currentUser?: string;
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
    issues: () => [],
  },
);

const emit = defineEmits<{
  selectIssue: [number: number];
  /**
   * Emitted when the users selects an estimation for the current issue.
   */
  estimate: [value: number];
}>();

const selectedIssue = computed(() => {
  return props.issues?.find((i) => i.number === props.lobby?.selectedIssue);
});

const user = computed(() => {
  return props.lobby?.users.find((i) => i.name === props.currentUser);
});

const userRole = computed(() => user.value?.role ?? "user");
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
      v-if="userRole === 'admin'"
      class="lobby__table"
      :issues="props.issues ?? []"
      :selected-issue="props.lobby?.selectedIssue"
      :skeleton="props.loading || props.issuesLoading"
      @select="emit('selectIssue', $event)"
    />

    <template v-if="selectedIssue">
      <OnyxHeadline is="h3">{{ $t("lobby.estimation.headline") }}</OnyxHeadline>

      <div class="lobby__estimations">
        <EstimationCard
          v-for="i in AVAILABLE_ESTIMATIONS"
          :key="i"
          :value="i"
          :selected="user?.estimation === i"
          @click="emit('estimate', i)"
        />
      </div>

      <GitHubIssueBodyRenderer :issue="selectedIssue" />
    </template>
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

  &__estimations {
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-xs);
    margin-top: var(--onyx-spacing-xs);
    margin-bottom: var(--onyx-spacing-lg);
  }
}
</style>
