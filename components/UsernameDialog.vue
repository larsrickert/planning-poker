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
  <OnyxModalDialog :label="$t('username.dialogHeadline')" alert :open="props.open">
    <template #description>{{ $t("username.description") }}</template>

    <OnyxForm class="form" @submit.prevent="handleSubmit">
      <div class="form__content">
        <OnyxInput
          v-model="username"
          class="form__input"
          :label="$t('username.label')"
          :placeholder="$t('username.placeholder')"
          required
          autofocus
        />
      </div>

      <OnyxBottomBar class="form__footer">
        <OnyxButton :label="$t('username.submitLabel')" type="submit" />
      </OnyxBottomBar>
    </OnyxForm>
  </OnyxModalDialog>
</template>

<style lang="scss" scoped>
.form {
  &__content {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--onyx-spacing-xl);
    padding: var(--onyx-density-xl) var(--onyx-modal-dialog-padding-inline);
  }

  &__input {
    width: 16rem;
    max-width: 100%;
  }

  &__footer {
    :deep(.onyx-bottom-bar__content) {
      padding-inline: var(--onyx-modal-dialog-padding-inline);
    }
  }
}
</style>
