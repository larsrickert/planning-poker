<script lang="ts" setup>
const props = defineProps<{
  isOwner: boolean;
  users?: EnrichedUser[];
  status?: PlanningSession["status"];
}>();

const emit = defineEmits<{
  revealEstimations: [];
}>();

const { t } = useI18n();

const votedUsers = computed(() => props.users?.filter((user) => user.estimation).length ?? 0);

const revealButton = computed(() => {
  const userCount = props.users?.length ?? 0;
  return {
    label: `${t("estimations.reveal.label")} (${votedUsers.value}/${userCount})`,
    allVoted: votedUsers.value === userCount,
  };
});

const showRevealConfirmModal = ref(false);

const handleReveal = () => {
  if (revealButton.value.allVoted) emit("revealEstimations");
  else showRevealConfirmModal.value = true;
};

const handleConfirmReveal = () => {
  emit("revealEstimations");
  showRevealConfirmModal.value = false;
};

const showEstimationsModal = ref(false);
watch(
  () => props.status,
  (newStatus) => {
    if (newStatus === "reveal") showEstimationsModal.value = true;
    else if (newStatus === "vote") showEstimationsModal.value = false;
  },
  { immediate: true },
);
</script>

<template>
  <OnyxSidebar class="sidebar" :label="$t('users.user', 2)">
    <template #header>
      <OnyxHeadline is="h3">
        {{ $t("users.user", 2) }}
        <span class="text--medium">({{ props.users?.length ?? 0 }})</span>
      </OnyxHeadline>
    </template>

    <div class="sidebar__content">
      <UserSidebarItem v-for="user in props.users" :key="user.id" :user :status="props.status" />
    </div>

    <template v-if="props.isOwner" #footer>
      <OnyxButton
        :label="revealButton.label"
        :color="revealButton.allVoted ? 'primary' : 'neutral'"
        :disabled="!votedUsers || props.status === 'reveal'"
        @click="handleReveal"
      />
    </template>

    <ConfirmRevealModal v-model:open="showRevealConfirmModal" @confirm="handleConfirmReveal" />

    <EstimationsModal v-model:open="showEstimationsModal" :users="props.users" />
  </OnyxSidebar>
</template>

<style lang="scss" scoped>
.sidebar {
  &__content {
    padding: var(--onyx-sidebar-padding);
    display: flex;
    flex-direction: column;
    gap: var(--onyx-density-2xs);
  }
}
</style>
