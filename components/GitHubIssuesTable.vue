<script lang="ts" setup>
import {
  OnyxAvatar,
  OnyxAvatarStack,
  OnyxBadge,
  OnyxEmpty,
  OnyxInput,
  OnyxLink,
  OnyxSkeleton,
  OnyxTable,
  OnyxTooltip,
} from "sit-onyx";
import type { GitHubIssue } from "~/types/github";

const props = defineProps<{
  issues: GitHubIssue[];
  selectedIssue?: number;
  skeleton?: boolean;
}>();

const emit = defineEmits<{
  select: [number: number];
}>();

const isOpen = ref(true);

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

    <OnyxSkeleton v-if="props.skeleton" class="table-skeleton" />

    <OnyxEmpty v-else-if="!props.issues.length">
      {{ $t("issues.empty") }}
    </OnyxEmpty>

    <details v-else :open="isOpen" @toggle="isOpen = $event.target.open">
      <summary>{{ isOpen ? $t("issues.hide") : $t("issues.show") }}</summary>

      <OnyxInput
        v-model="searchValue"
        class="search"
        :label="$t('issues.search.label')"
        :placeholder="$t('issues.search.placeholder')"
      />

      <OnyxEmpty v-if="!filteredIssues.length">
        {{ $t("issues.search.noResults") }}
      </OnyxEmpty>

      <OnyxTable v-else striped grid>
        <thead>
          <tr>
            <th>{{ $t("issues.id") }}</th>
            <th>{{ $t("issues.title") }}</th>
            <th>{{ $t("issues.assignees") }}</th>
            <th>{{ $t("issues.labels") }}</th>
          </tr>
        </thead>

        <tbody>
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
                  :label="assignee.login"
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
                  <OnyxBadge
                    density="compact"
                    :style="`--onyx-badge-background-color: #${label.color}`"
                  >
                    {{ label.name }}
                  </OnyxBadge>
                </OnyxTooltip>
              </div>
            </td>
          </tr>
        </tbody>
      </OnyxTable>
    </details>
  </div>
</template>

<style lang="scss" scoped>
.description {
  margin-bottom: var(--onyx-spacing-md);
}

.table-skeleton {
  width: 24rem;
  max-width: 100%;
  height: 12rem;
}

.onyx-table {
  overflow: auto;
  max-height: 24rem;
  display: block;
  width: max-content;
  max-width: 100%;

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
}

details {
  width: max-content;
  max-width: 100%;

  summary {
    margin-bottom: var(--onyx-spacing-2xs);
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

.search {
  margin-bottom: var(--onyx-spacing-lg);
  max-width: 20rem;
}
</style>
