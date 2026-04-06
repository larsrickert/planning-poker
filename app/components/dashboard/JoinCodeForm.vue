<script lang="ts" setup>
import { iconSend } from "@sit-onyx/icons";

const emit = defineEmits<{
  submit: [code: string];
}>();

const planningCode = ref("");

const joinButton = useTemplateRef("joinButton");
watchEffect(() => {
  const el = joinButton.value?.$el as HTMLElement | undefined;
  const button = el?.querySelector("button");
  if (!button) return;
  button.type = "submit";
});

const handleJoinPlanning = async () => {
  const code = planningCode.value.trim();
  if (!code) return;
  emit("submit", code);
};
</script>

<template>
  <OnyxForm @submit.prevent="handleJoinPlanning">
    <OnyxInput
      v-model="planningCode"
      :label="$t('sessions.join.code')"
      :minlength="4"
      :maxlength="4"
      disable-slot-padding
      with-counter
      required
      autofocus
    >
      <template #trailing>
        <OnyxUnstableFormElementAction
          ref="joinButton"
          :icon="iconSend"
          :label="$t('sessions.join.headline')"
          size="lg"
        />
      </template>
    </OnyxInput>
  </OnyxForm>
</template>

<style lang="scss" scoped></style>
