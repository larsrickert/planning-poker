<script lang="ts" setup>
const props = defineProps<{
  /**
   * Whether the user is currently creating a room.
   */
  loading?: boolean;
}>();

const emit = defineEmits<{
  createRoom: [repository: string];
}>();
</script>

<template>
  <div>
    <p>{{ $t("room.create.description") }}</p>
    <CreateRoomForm class="form" :loading="props.loading" @submit="emit('createRoom', $event)" />
  </div>
</template>

<style lang="scss" scoped>
.form {
  margin-top: var(--onyx-spacing-lg);
}
</style>
