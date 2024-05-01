<script lang="ts" setup>
import { OnyxButton, OnyxInput } from "sit-onyx";

const modelValue = defineModel<string>({ default: "" });

const username = ref("");
watchEffect(() => (username.value = modelValue.value));

const handleSubmit = () => {
  modelValue.value = username.value;
};
</script>

<template>
  <AppDialog open>
    <p class="description">{{ $t("username.description") }}</p>

    <form class="form" @submit.prevent="handleSubmit">
      <OnyxInput
        v-model="username"
        :label="$t('username.label')"
        :placeholder="$t('username.placeholder')"
        required
      />

      <OnyxButton :label="$t('username.submitLabel')" type="submit" mode="outline" />
    </form>
  </AppDialog>
</template>

<style lang="scss" scoped>
.description {
  white-space: pre-line;
  margin-top: 0;
  margin-bottom: var(--onyx-spacing-lg);
}

.form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--onyx-spacing-xl);

  .onyx-input {
    width: 16rem;
  }
}
</style>
