<script lang="ts" setup>
const authStore = useAuthStore();

const isDialogOpen = ref(false);
</script>

<template>
  <OnyxAppLayout class="onyx-grid-max-md onyx-grid-center">
    <template #navBar>
      <NavBar
        :username="authStore.username"
        :avatar="authStore.avatar"
        @change-username="isDialogOpen = true"
      />
    </template>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UsernameDialog
      v-model="authStore.username"
      :open="!authStore.username || isDialogOpen"
      @update:model-value="isDialogOpen = false"
    />

    <OnyxToast />
  </OnyxAppLayout>
</template>
