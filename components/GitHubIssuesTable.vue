<script lang="ts" setup>
import type { GitHubIssue } from "~/types/github";

const props = defineProps<{
  issues: GitHubIssue[];
  selectedIssue?: number;
  skeleton?: boolean;
}>();

const emit = defineEmits<{
  select: [number: number];
}>();

const searchValue = ref("");

const filteredIssues = computed(() => {
  const search = searchValue.value.toLowerCase();
  if (!search.length) return props.issues;

  return props.issues.filter((issue) => {
    const isIssueNumber = !isNaN(+search.replace("#", ""));
    if (isIssueNumber) return issue.number.toString().startsWith(search.replace("#", ""));
    return issue.title.toLowerCase().includes(search);
  });
});
</script>

<template>
  <div>
    <p class="description">{{ $t("issues.description") }}</p>

    <div class="onyx-grid">
      <OnyxInput
        v-model="searchValue"
        class="onyx-grid-span-4"
        :label="$t('issues.search.label')"
        :placeholder="$t('issues.search.placeholder')"
        :skeleton="props.skeleton"
      />

      <OnyxTable class="table onyx-grid-span-full" striped with-vertical-borders>
        <template #headline>
          <OnyxHeadline is="h2">
            {{ $t("issues.issues") }}
            <span class="table__count"> ({{ props.issues.length }})</span>
          </OnyxHeadline>
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
            v-for="issue in filteredIssues"
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
