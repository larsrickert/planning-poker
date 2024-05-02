<script lang="ts" setup>
import {
  OnyxAvatar,
  OnyxAvatarStack,
  OnyxEmpty,
  OnyxLink,
  OnyxSkeleton,
  OnyxTable,
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

      <OnyxTable striped grid>
        <thead>
          <tr>
            <th>{{ $t("issues.id") }}</th>
            <th>{{ $t("issues.title") }}</th>
            <th>{{ $t("issues.assignees") }}</th>
          </tr>
        </thead>

        <tbody>
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
                  :label="assignee.login"
                  :src="assignee.avatar_url"
                  size="24px"
                />
              </OnyxAvatarStack>
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
  height: 12rem;
}

.onyx-table {
  overflow: auto;
  max-height: 24rem;
  display: block;
  width: max-content;

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

  summary {
    margin-bottom: var(--onyx-spacing-2xs);
  }
}
</style>
