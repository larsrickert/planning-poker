<script lang="ts" setup>
const roomStore = useRoomStore();
const router = useRouter();

const handleCreateRoom = async (repository: string) => {
  const room = await roomStore.createRoom(repository);
  await router.push(`/rooms/${room.id}`);
};
</script>

<template>
  <HomeTemplate :loading="roomStore.isJoining" @create-room="handleCreateRoom" />
</template>
