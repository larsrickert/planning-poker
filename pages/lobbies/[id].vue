<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";
import type { GitHubIssue } from "../../types/github";

const route = useRoute();
const socketStore = useSocketStore();

watchEffect(() => {
  if (!socketStore.username) return;
  const idParam = route.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  socketStore.joinLobby(id);
});

const isIssuesLoading = ref(false);

const repository = computed(() => socketStore.lobby?.repository);

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
  <LobbyTemplate
    :lobby="socketStore.lobby"
    :loading="socketStore.isJoiningLobby || !socketStore.username"
    :issues-loading="isIssuesLoading"
    :current-user="socketStore.username"
    :issues="issues"
    @select-issue="socketStore.selectIssue"
    @estimate="socketStore.estimate"
    @reveal-estimations="socketStore.revealEstimations"
  />
</template>
