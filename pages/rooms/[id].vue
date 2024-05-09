<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
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

const isIssuesLoading = ref(false);

const repository = computed(() => roomStore.room?.repository.name);

/**
 * @see https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
 */
const issues = computedAsync(
  async () => {
    if (!repository.value) return [];

    // TODO: implement pagination
    const response = await fetch(
      `https://api.github.com/search/issues?per_page=100&q=${encodeURIComponent(`is:issue state:open repo:${repository.value}`)}`,
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
    evaluating: isIssuesLoading,
  },
);
</script>

<template>
  <RoomTemplate
    :room="roomStore.room"
    :loading="roomStore.isJoining || !authStore.username"
    :issues-loading="isIssuesLoading"
    :current-user="authStore.username"
    :issues="issues"
    @select-story="roomStore.selectStory"
    @estimate="roomStore.estimate"
    @end-estimation="roomStore.endEstimation"
  />
</template>
