<script lang="ts" setup>
const modelValue = defineModel<string>({ default: "" });

const props = defineProps<{
  open?: boolean;
}>();

const username = ref("");
watchEffect(() => (username.value = modelValue.value));

const handleSubmit = () => {
  modelValue.value = username.value;
};
</script>

<template>
  <OnyxDialog :label="$t('username.dialogHeadline')" modal alert :open="props.open">
    <OnyxHeadline is="h2">{{ $t("username.dialogHeadline") }}</OnyxHeadline>
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
  </OnyxDialog>
</template>

<style lang="scss" scoped>
.description {
  white-space: pre-line;
  margin-top: var(--onyx-spacing-sm);
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
