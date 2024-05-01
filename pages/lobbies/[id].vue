<script lang="ts" setup>
const route = useRoute();
const socketStore = useSocketStore();

watchEffect(() => {
  const idParam = route.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  socketStore.joinLobby(id);
});
</script>

<template>
  <LobbyTemplate :lobby="socketStore.lobby" :loading="socketStore.isJoiningLobby" />
</template>
