<script lang="ts" setup>
import { useToast } from "sit-onyx";

definePageMeta({ layout: false, middleware: ["auth"] });

const { t } = useI18n();
const route = useRoute();
const { user } = useUserSession();
const toast = useToast();

const id = computed(() => {
  const param = route.params.id;
  return Array.isArray(param) ? param[0] : param;
});

useWebSocket("/ws/updates", {
  autoReconnect: true,
  onConnected: (ws) => {
    ws.send(JSON.stringify({ type: "subscribe", sessionId: id.value }));
  },
  onMessage: () => {
    refreshAllData();
  },
});

const { data: session, refresh: refreshSession } = useFetch(() => `/api/sessions/${id.value}`);
useHead({ title: computed(() => session.value?.name) });

const { data: users, refresh: refreshUsers } = useFetch(() => `/api/sessions/${id.value}/users`);

const refreshAllData = async () => {
  await Promise.allSettled([refreshSession(), refreshUsers()]);
};

const currentUser = computed(() => users.value?.find((i) => i.email === user.value?.email));

const isSessionOwner = computed(() => {
  return !!currentUser.value && !!session.value && currentUser.value.id === session.value.userId;
});

const { executeImmediate: handleUpdateStory } = useAsyncState(
  async (story?: PlanningStory) => {
    await $fetch(`/api/sessions/${id.value}`, {
      method: "PATCH",
      body: { story: story ?? null },
    });
  },
  undefined,
  {
    immediate: false,
    onError: (e) => {
      toast.show({
        headline: t("sessions.toasts.update.error"),
        description: getErrorMessage(e),
        color: "danger",
      });
    },
  },
);

const selectedEstimation = computed({
  get: () => {
    const estimation = currentUser.value?.estimation;
    return typeof estimation === "number" ? estimation : undefined;
  },
  set: (newEstimation) => handleUpdateEstimation(newEstimation),
});

const { executeImmediate: handleUpdateEstimation } = useAsyncState(
  async (newEstimation?: number) => {
    await $fetch(`/api/sessions/${id.value}/estimate`, {
      method: "PATCH",
      body: {
        estimation: newEstimation || null,
      },
    });
  },
  undefined,
  {
    immediate: false,
    onError: (e) => {
      toast.show({
        headline: t("sessions.toasts.updateEstimation.error"),
        description: getErrorMessage(e),
        color: "danger",
      });
    },
  },
);

const { executeImmediate: handleRevealEstimations } = useAsyncState(
  async () => {
    await $fetch(`/api/sessions/${id.value}`, {
      method: "PATCH",
      body: { status: "reveal" },
    });
  },
  undefined,
  {
    immediate: false,
    onError: (e) => {
      toast.show({
        headline: t("sessions.toasts.reveal.error"),
        description: getErrorMessage(e),
        color: "danger",
      });
    },
  },
);

const joinCodeLink = computed(() => {
  if (!session.value || !globalThis.location) return;
  return `${window.location.origin}/sessions/join/${session.value.joinCode}`;
});
</script>

<template>
  <OnyxPageLayout>
    <template #sidebar>
      <PlanningSidebar
        :users
        :is-owner="isSessionOwner"
        :status="session?.status"
        @reveal-estimations="handleRevealEstimations"
      />
    </template>

    <OnyxEmpty v-if="!session"> {{ $t("sessions.notFound") }} </OnyxEmpty>

    <div v-else class="page">
      <OnyxHeadline is="h1"> {{ session.name }} </OnyxHeadline>

      <div class="onyx-grid">
        <DetailsItem
          v-if="session.source === 'github'"
          class="onyx-grid-span-4"
          :label="$t('repositories.repository')"
        >
          {{ session.repository ?? "-" }}
        </DetailsItem>

        <DetailsItem class="onyx-grid-span-4" :label="$t('sessions.join.code')">
          {{ session.joinCode }}

          <ClientOnly>
            <CopyButton v-if="joinCodeLink" :value="joinCodeLink" />
          </ClientOnly>
        </DetailsItem>
      </div>

      <StorySelection v-if="isSessionOwner" :session @update:story="handleUpdateStory" />

      <div class="section">
        <OnyxHeadline is="h2">{{ $t("estimations.select") }}</OnyxHeadline>
        <EstimationVote
          v-model="selectedEstimation"
          :estimations="session.estimationUnits"
          :disabled="!session.story || session.status !== 'vote'"
        />
      </div>

      <div class="section">
        <OnyxHeadline is="h2">{{ $t("stories.story") }}</OnyxHeadline>

        <OnyxCard>
          <OnyxEmpty v-if="!session.story" class="empty">
            {{ $t("stories.noSelected") }}
          </OnyxEmpty>

          <template v-else>
            <OnyxHeadline is="h3" show-as="h2">{{ session.story.title }}</OnyxHeadline>
            <MarkdownRenderer :markdown="session.story.content ?? ''" />
          </template>
        </OnyxCard>
      </div>
    </div>
  </OnyxPageLayout>
</template>

<style lang="scss" scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: var(--onyx-density-sm);
}

.empty {
  margin-inline: auto;
}
</style>
