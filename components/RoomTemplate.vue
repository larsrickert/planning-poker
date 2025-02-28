<script lang="ts" setup>
import hourglass from "@sit-onyx/icons/hourglass.svg?raw";
import type { RoomDto } from "~/server/types";
import type { GitHubIssue } from "~/types/github";
import EstimationCard from "./EstimationCard.vue";

export type EstimationMethod = keyof typeof ESTIMATION_METHODS;

const ESTIMATION_METHODS = {
  "Story Points": [1, 2, 3, 5, 8, 13],
  Hours: [4, 8, 12, 24, 48, 72],
  Days: [0.5, 1, 2, 3, 5, 10],
} as const;

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
  selectMethod: [name: EstimationMethod];
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

const methodOptions = computed(() =>
  Object.keys(ESTIMATION_METHODS).map((key) => ({
    label: key,
    value: key as EstimationMethod,
  })),
);

const estimationMethod = computed(() => props.room?.selectedMethod ?? "Story Points");

const availableEstimations = computed(() => ESTIMATION_METHODS[estimationMethod.value]);
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

    <OnyxEmpty v-else-if="!selectedIssue">
      <template #icon>
        <OnyxIcon :icon="hourglass" size="48px" />
      </template>

      {{ $t("room.waitingForModerator") }}
    </OnyxEmpty>

    <template v-if="selectedIssue">
      <AverageEstimation
        v-if="props.room?.averageEstimation"
        :estimation="props.room.averageEstimation"
        :users="props.room.users"
      />

      <template v-else>
        <OnyxHeadline is="h3">
          {{ $t("room.estimation.headline", { method: estimationMethod }) }}
        </OnyxHeadline>

        <div class="estimations">
          <OnyxSelect
            v-if="isModerator"
            :options="methodOptions"
            :model-value="estimationMethod"
            :label="$t('room.estimation.method-select')"
            :list-label="$t('room.estimation.methods')"
            @update:model-value="emit('selectMethod', $event as EstimationMethod)"
          />
          <div class="estimations__cards">
            <EstimationCard
              v-for="i in availableEstimations"
              :key="i"
              class="estimation"
              :value="i"
              :selected="user?.estimation === i"
              @click="emit('estimate', i)"
            />
          </div>

          <OnyxButton
            v-if="isModerator"
            :label="
              $t('room.estimation.reveal', {
                n: votedUsers,
                count: props.room?.users.length ?? 0,
              })
            "
            color="neutral"
            mode="outline"
            :disabled="votedUsers === 0"
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
  margin-top: var(--onyx-spacing-xs);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--onyx-spacing-lg) var(--onyx-spacing-2xl);

  &__cards {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--onyx-spacing-xs);
  }
}
</style>
