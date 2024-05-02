<script lang="ts" setup>
import { computedAsync } from "@vueuse/core";

const route = useRoute();
const socketStore = useSocketStore();

watchEffect(() => {
  const idParam = route.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  socketStore.joinLobby(id);
});

/**
 * @see https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
 */
const issues = computedAsync(async () => {
  if (!socketStore.lobby) return [];

  // TODO: implement pagination
  const response = await fetch(
    `https://api.github.com/repos/${socketStore.lobby.repository}/issues?per_page=100`,
    {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        Accept: "application/vnd.github.html+json",
      },
    },
  );

  if (!response.ok) return [];
  return await response.json();
}, []);
</script>

<template>
  <LobbyTemplate
    :lobby="socketStore.lobby"
    :loading="socketStore.isJoiningLobby && socketStore.isConnected"
    :role="socketStore.currentUser?.role ?? 'user'"
    :issues="issues"
    @select-issue="socketStore.selectIssue"
  />
</template>
