<script lang="ts" setup>
import plusSmall from "@sit-onyx/icons/plus-small.svg?raw";
import { OnyxButton, OnyxInput } from "sit-onyx";

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
  <form class="form" @submit.prevent="handleSubmit">
    <OnyxInput
      v-model="repository"
      :label="$t('lobby.create.githubRepo.label')"
      :placeholder="$t('lobby.create.githubRepo.placeholder')"
      :pattern="/\S+\/\S+/"
      autocapitalize="none"
      :readonly="props.loading"
      required
    />

    <OnyxButton
      :label="$t('lobby.create.submitLabel')"
      type="submit"
      mode="outline"
      :icon="plusSmall"
      :loading="props.loading"
    />
  </form>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: var(--onyx-spacing-xl);

  .onyx-input {
    width: 16rem;
  }
}
</style>
