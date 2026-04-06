<script lang="ts" setup>
import { iconTriangleWarning } from "@sit-onyx/icons";

const emit = defineEmits<{
  confirm: [];
}>();

const open = defineModel<boolean>("open");
</script>

<template>
  <OnyxAlertModal
    v-model:open="open"
    :icon="{ icon: iconTriangleWarning, color: 'warning' }"
    :label="$t('estimations.reveal.confirm.label')"
  >
    {{ $t("estimations.reveal.confirm.description") }}

    <template #actions>
      <OnyxButton
        :label="$t('cancel')"
        color="neutral"
        mode="plain"
        autofocus
        @click="open = false"
      />
      <OnyxButton :label="$t('estimations.reveal.label')" @click="emit('confirm')" />
    </template>
  </OnyxAlertModal>
</template>
