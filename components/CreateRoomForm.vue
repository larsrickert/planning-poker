<script lang="ts" setup>
import plusSmall from "@sit-onyx/icons/plus-small.svg?raw";

const props = defineProps<{
  /**
   * Whether the form is currently loading.
   */
  loading?: boolean;
}>();

const emit = defineEmits<{
  submit: [repository: string];
}>();

const repository = ref("");

const handleSubmit = () => {
  emit("submit", repository.value);
};
</script>

<template>
  <form class="form onyx-grid" @submit.prevent="handleSubmit">
    <OnyxInput
      v-model="repository"
      class="onyx-grid-span-4"
      :label="$t('room.create.githubRepo.label')"
      :placeholder="$t('room.create.githubRepo.placeholder')"
      :pattern="/\S+\/\S+/"
      autocapitalize="none"
      :readonly="props.loading"
      required
    />

    <OnyxButton
      class="onyx-grid-span-4"
      :label="$t('room.create.submitLabel')"
      type="submit"
      mode="outline"
      :icon="plusSmall"
      :loading="props.loading"
    />
  </form>
</template>

<style lang="scss" scoped>
.form {
  align-items: flex-end;

  &:has(input:user-invalid) {
    align-items: center;
  }
}
</style>
