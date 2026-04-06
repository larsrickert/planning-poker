<script lang="ts" setup>
import { useToast } from "sit-onyx";

definePageMeta({ layout: false });

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

const { data, status, refresh: refreshSession } = useFetch(() => `/api/sessions/${id.value}`);
const isLoading = computed(() => status.value === "pending");
useHead({ title: computed(() => data.value?.name) });

const { data: users, refresh: refreshUsers } = useFetch(() => `/api/sessions/${id.value}/users`);

const refreshAllData = async () => {
  await Promise.allSettled([refreshSession(), refreshUsers()]);
};

const currentUser = computed(() => users.value?.find((i) => i.email === user.value?.email));

const isSessionOwner = computed(() => {
  return !!currentUser.value && !!data.value && currentUser.value.id === data.value.userId;
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
        description: (e as Error).message,
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
        description: (e as Error).message,
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
        description: (e as Error).message,
        color: "danger",
      });
    },
  },
);

const joinCodeLink = computed(() => {
  if (!data.value || !globalThis.location) return;
  return `${window.location.origin}/sessions/join/${data.value.joinCode}`;
});
</script>

<template>
  <OnyxPageLayout>
    <template #sidebar>
      <PlanningSidebar
        :users
        :is-owner="isSessionOwner"
        :status="data?.status"
        @reveal-estimations="handleRevealEstimations"
      />
    </template>

    <OnyxEmpty v-if="!data && !isLoading">
      {{ $t("sessions.notFound") }}
    </OnyxEmpty>

    <div v-else class="page">
      <OnyxHeadline is="h1" :skeleton="isLoading"> {{ data?.name }} </OnyxHeadline>

      <div class="onyx-grid">
        <DetailsItem
          v-if="data?.source === 'github'"
          class="onyx-grid-span-4"
          :label="$t('repositories.repository')"
          :skeleton="isLoading"
        >
          {{ data?.repository ?? "-" }}
        </DetailsItem>

        <DetailsItem
          class="onyx-grid-span-4"
          :label="$t('sessions.join.code')"
          :skeleton="isLoading"
        >
          {{ data?.joinCode ?? "-" }}

          <ClientOnly>
            <CopyButton v-if="joinCodeLink" :value="joinCodeLink" />
          </ClientOnly>
        </DetailsItem>
      </div>

      <StorySelection
        v-if="isSessionOwner && data"
        :session="data"
        @update:story="handleUpdateStory"
      />

      <div class="section">
        <OnyxHeadline is="h2">{{ $t("estimations.select") }}</OnyxHeadline>
        <EstimationVote
          v-model="selectedEstimation"
          :estimations="data?.estimationUnits ?? []"
          :disabled="!data?.story || data.status !== 'vote'"
        />
      </div>

      <div class="section">
        <OnyxHeadline is="h2">{{ $t("stories.story") }}</OnyxHeadline>

        <OnyxCard>
          <OnyxEmpty v-if="!data?.story" class="empty">
            {{ $t("stories.noSelected") }}
          </OnyxEmpty>

          <template v-else>
            <OnyxHeadline is="h3" show-as="h2">{{ data.story.title }}</OnyxHeadline>
            <MarkdownRenderer :markdown="data.story.content ?? ''" />
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
