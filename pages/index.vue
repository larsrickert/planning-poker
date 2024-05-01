<script lang="ts" setup>
const socketStore = useSocketStore();
const router = useRouter();

const handleCreateLobby = async (repository: string) => {
  const lobby = await socketStore.createLobby(repository);
  await router.push(`/lobbies/${lobby.id}`);
};
</script>

<template>
  <HomeTemplate :loading="socketStore.isJoiningLobby" @create-lobby="handleCreateLobby" />
</template>
