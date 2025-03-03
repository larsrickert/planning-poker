<script lang="ts" setup>
import { useAsyncState, watchDebounced } from "@vueuse/core";
import type { IssueFilters } from "~/components/GitHubIssuesTable.vue";
import type { GitHubIssue } from "../../types/github";

const route = useRoute();
const roomStore = useRoomStore();
const authStore = useAuthStore();

watchEffect(() => {
  if (!authStore.username) return;
  const idParam = route.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  roomStore.joinRoom(id);
});

const filters = ref<IssueFilters>({});
const repository = computed(() => roomStore.room?.repository.name);

/**
 * @see https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
 */
const {
  isLoading,
  state: issues,
  execute: refreshIssues,
} = useAsyncState(
  async () => {
    if (!repository.value) return [];

    const searchParts = ["is:issue", "state:open", `repo:${repository.value}`];
    if (filters.value.search) {
      const number = +filters.value.search.replaceAll("#", "");
      if (!isNaN(number)) {
        searchParts.push(filters.value.search);
      } else {
        searchParts.push(`in:title ${filters.value.search}`);
      }
    }

    const response = await fetch(
      `https://api.github.com/search/issues?per_page=100&page=${1}&q=${encodeURIComponent(searchParts.join(" "))}`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github.html+json",
        },
      },
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.items as GitHubIssue[];
  },
  [],
  {
    immediate: false,
    resetOnExecute: false,
  },
);

watch(repository, () => refreshIssues(), { immediate: true });
watchDebounced(filters, () => refreshIssues(), { debounce: 500, deep: true });
</script>

<template>
  <RoomTemplate
    v-model:filters="filters"
    :room="roomStore.room"
    :loading="roomStore.isJoining || !authStore.username"
    :issues-loading="isLoading"
    :current-user="authStore.username"
    :issues="issues"
    @select-story="roomStore.selectStory"
    @estimate="roomStore.estimate"
    @select-method="roomStore.selectMethod"
    @end-estimation="roomStore.endEstimation"
  />
</template>
