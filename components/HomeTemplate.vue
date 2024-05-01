<script lang="ts" setup>
const props = defineProps<{
  /**
   * Whether the user is currently creating the lobby.
   */
  loading?: boolean;
}>();

const emit = defineEmits<{
  createLobby: [repository: string];
}>();
</script>

<template>
  <div>
    <p>{{ $t("lobby.create.description") }}</p>
    <CreateLobbyForm class="form" :loading="props.loading" @submit="emit('createLobby', $event)" />
  </div>
</template>

<style lang="scss" scoped>
.form {
  margin-top: var(--onyx-spacing-lg);
}
</style>
