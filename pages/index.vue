<script lang="ts" setup>
const socketStore = useSocketStore();
const router = useRouter();

const handleLobbyCreate = async (repository: string) => {
  const lobby = await socketStore.createLobby(repository);
  await router.push(`/lobbies/${lobby.id}`);
};
</script>

<template>
  <div>
    <p>{{ $t("lobby.create.description") }}</p>

    <CreateLobbyForm
      class="form"
      :loading="socketStore.isJoiningLobby"
      @submit="handleLobbyCreate"
    />
  </div>
</template>

<style lang="scss" scoped>
.form {
  margin-top: var(--onyx-spacing-lg);
}
</style>
