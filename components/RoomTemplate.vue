<script lang="ts" setup>
import { OnyxButton, OnyxEmpty, OnyxHeadline, OnyxLink } from "sit-onyx";
import type { RoomDto } from "~/server/types";
import type { GitHubIssue } from "~/types/github";
import EstimationCard from "./EstimationCard.vue";

const AVAILABLE_ESTIMATIONS = [1, 2, 3, 5, 8, 13] as const;

const props = withDefaults(
  defineProps<{
    /**
     * Currently room state.
     */
    room?: RoomDto;
    /**
     * Current username. Will determine which features are enabled based on the user role.
     */
    currentUser?: string;
    /**
     * Whether the user is currently joining the room.
     */
    loading?: boolean;
    /**
     * Whether the GitHub issues are currently loading.
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
  selectStory: [number: number];
  /**
   * Emitted when the users selects an estimation for the current story.
   */
  estimate: [value: number];
  endEstimation: [];
}>();

const selectedIssue = computed(() => {
  return props.issues?.find((i) => i.number === props.room?.selectedStory);
});

const user = computed(() => {
  return props.room?.users.find((i) => i.username === props.currentUser);
});

const isModerator = computed(() => user.value?.id === props.room?.moderator);

const votedUsers = computed(() => props.room?.users.filter((i) => i.estimation).length ?? 0);
</script>

<template>
  <div class="room">
    <RoomHeader class="room__header" :room="props.room" :skeleton="props.loading" />

    <OnyxEmpty v-if="!props.loading && !props.room">
      <i18n-t keypath="room.notFound.text">
        <template #link>
          <OnyxLink href="/">{{ $t("room.notFound.link") }}</OnyxLink>
        </template>
      </i18n-t>
    </OnyxEmpty>

    <GitHubIssuesTable
      v-else-if="isModerator"
      class="room__table"
      :issues="props.issues ?? []"
      :selected-issue="props.room?.selectedStory"
      :skeleton="props.loading || props.issuesLoading"
      @select="emit('selectStory', $event)"
    />

    <p v-else-if="!selectedIssue">
      {{ $t("room.waitingForModerator") }}
    </p>

    <template v-if="selectedIssue">
      <AverageEstimation
        v-if="props.room?.averageEstimation"
        :estimation="props.room.averageEstimation"
        :users="props.room.users"
      />

      <template v-else>
        <OnyxHeadline is="h3">{{ $t("room.estimation.headline") }}</OnyxHeadline>

        <div class="estimations">
          <EstimationCard
            v-for="i in AVAILABLE_ESTIMATIONS"
            :key="i"
            :value="i"
            :selected="user?.estimation === i"
            @click="emit('estimate', i)"
          />

          <OnyxButton
            v-if="isModerator"
            class="estimations__reveal"
            :label="
              $t('room.estimation.reveal', {
                n: votedUsers,
                count: props.room?.users.length ?? 0,
              })
            "
            variation="secondary"
            mode="outline"
            @click="emit('endEstimation')"
          />
        </div>
      </template>

      <GitHubIssueBodyRenderer class="room__issue" :issue="selectedIssue" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.room {
  &__header {
    margin-bottom: var(--onyx-spacing-md);
  }

  &__table {
    margin-bottom: var(--onyx-spacing-3xl);
  }

  &__issue {
    margin-top: var(--onyx-spacing-lg);
  }
}

.estimations {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--onyx-spacing-xs);
  margin-top: var(--onyx-spacing-xs);

  &__reveal {
    margin-left: var(--onyx-spacing-2xl);
  }
}
</style>
