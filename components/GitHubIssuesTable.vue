<script lang="ts" setup>
import type { GitHubIssue } from "~/types/github";

export type IssueFilters = Partial<{
  search: string;
}>;

const props = defineProps<{
  issues: GitHubIssue[];
  selectedIssue?: number;
  skeleton?: boolean;
}>();

const emit = defineEmits<{
  select: [number: number];
}>();

const filters = defineModel<IssueFilters>("filters", { default: () => ({}) });
</script>

<template>
  <div>
    <p class="description">{{ $t("issues.description") }}</p>

    <OnyxTable class="table" striped with-vertical-borders>
      <template #headline>
        <OnyxHeadline is="h2">
          {{ $t("issues.issues") }}
          <span class="table__count"> ({{ props.issues.length }})</span>
        </OnyxHeadline>
      </template>

      <template #actions>
        <OnyxInput
          v-model="filters.search"
          class="table__search"
          :label="$t('issues.search.label')"
          :placeholder="$t('issues.search.placeholder')"
          :skeleton="props.skeleton && !props.issues.length"
          density="compact"
          :readonly="props.skeleton"
          hide-label
        />
      </template>

      <template #head>
        <th>{{ $t("issues.id") }}</th>
        <th>{{ $t("issues.title") }}</th>
        <th>{{ $t("issues.assignees") }}</th>
        <th>{{ $t("issues.labels") }}</th>
      </template>

      <template v-if="props.skeleton">
        <tr v-for="skeletonRow in 4" :key="skeletonRow">
          <td v-for="skeletonColumn in 4" :key="skeletonColumn">
            <OnyxSkeleton class="table__skeleton" />
          </td>
        </tr>
      </template>

      <template v-else>
        <tr
          v-for="issue in props.issues"
          :key="issue.number"
          :class="{ selected: issue.number === props.selectedIssue }"
          @click="emit('select', issue.number)"
        >
          <td>
            <OnyxLink :href="issue.html_url" target="_blank"> #{{ issue.number }} </OnyxLink>
          </td>
          <td>{{ issue.title }}</td>
          <td>
            <OnyxAvatarStack v-if="issue.assignees.length">
              <OnyxAvatar
                v-for="assignee in issue.assignees"
                :key="assignee.login"
                :full-name="assignee.login"
                :src="assignee.avatar_url"
                size="24px"
              />
            </OnyxAvatarStack>
          </td>
          <td>
            <div class="labels">
              <OnyxTooltip
                v-for="label of issue.labels"
                :key="label.name"
                :text="label.description"
                position="bottom"
              >
                <template #default="{ trigger }">
                  <div v-bind="trigger">
                    <OnyxBadge
                      density="compact"
                      :style="`--onyx-badge-background-color: #${label.color}`"
                    >
                      {{ label.name }}
                    </OnyxBadge>
                  </div>
                </template>
              </OnyxTooltip>
            </div>
          </td>
        </tr>
      </template>
    </OnyxTable>
  </div>
</template>

<style lang="scss" scoped>
.description {
  margin-bottom: var(--onyx-spacing-md);
}

.table {
  max-height: 32rem;

  tbody tr {
    cursor: pointer;
  }

  tr.selected {
    td::before {
      background-color: var(--onyx-color-base-primary-200);
    }

    &:hover td::before {
      background-color: var(--onyx-color-base-primary-100);
    }
  }

  &__skeleton {
    height: 1lh;
    width: 100%;
  }

  &__count {
    color: var(--onyx-color-text-icons-neutral-soft);
  }

  &__search {
    width: 16rem;
    max-width: 100%;
  }
}

.labels {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--onyx-spacing-2xs);

  // needed to vertically center the badges
  :deep(.onyx-tooltip-wrapper div[aria-describedby]) {
    display: flex;
  }
}
</style>
