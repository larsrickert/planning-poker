<script lang="ts" setup>
import { iconCircleHelp, iconExpandWindow, iconPlusSmall } from "@sit-onyx/icons";
import { useToast, type SelectOption } from "sit-onyx";
import githubLogo from "~/assets/images/github-mark.svg?raw";
import { bugs } from "~~/package.json";

type EstimationUnitPreset = "story-points" | "days" | "custom";

definePageMeta({ layout: false, middleware: ["auth"] });

const { t } = useI18n();
useHead({ title: computed(() => t("sessions.create.new")) });
const toast = useToast();

const session = ref<Partial<InsertPlanningSession>>({
  source: "github",
});

const customUnits = ref<number[]>([]);
const selectedPreset = ref<EstimationUnitPreset>("days");
const formId = useId();

const estimationUnitOptions = computed<SelectOption<EstimationUnitPreset>[]>(() => [
  { label: t("day", 2), value: "days" },
  { label: t("stories.points", 2), value: "story-points" },
  { label: t("custom"), value: "custom" },
]);

const estimationUnits = computed(() => {
  switch (selectedPreset.value) {
    case "story-points":
      return [1, 2, 3, 5, 8, 13];
    case "days":
      return [0.125, 0.25, 0.5, 0.75, 1, 2, 3, 4, 5];
    case "custom":
      return customUnits.value;
    default:
      return [];
  }
});

const handleCustomUnitChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  customUnits.value = input.value
    .split(",")
    .map((i) => +i.trim())
    .filter((i) => !isNaN(i))
    .sort();
};

const { isLoading, execute: createSession } = useAsyncState(
  async () => {
    const _session = session.value as InsertPlanningSession;

    const body: InsertPlanningSession = {
      ..._session,
      name: _session.name.trim(),
      estimationUnits: estimationUnits.value.slice(),
    };

    const newSession = await $fetch("/api/sessions", { method: "POST", body });
    return newSession;
  },
  undefined,
  {
    immediate: false,
    onSuccess: async (newSession) => {
      toast.show({
        headline: t("sessions.toasts.create.success", { name: newSession?.name }),
        color: "success",
      });

      await navigateTo(`/sessions/${newSession?.id}`);
    },
    onError: (e) => {
      toast.show({
        headline: t("sessions.toasts.create.error"),
        description: (e as Error).message,
        color: "danger",
      });
    },
  },
);
</script>

<template>
  <NuxtLayout name="default">
    <OnyxForm :id="formId" class="page" :disabled="isLoading" @submit.prevent="createSession">
      <OnyxHeadline is="h1">{{ $t("sessions.create.new") }}</OnyxHeadline>

      <section class="section">
        <OnyxHeadline is="h2">{{ $t("settings.general") }}</OnyxHeadline>

        <div class="onyx-grid">
          <OnyxInput
            v-model="session.name"
            class="onyx-grid-span-4"
            :label="$t('sessions.name.label')"
            :placeholder="$t('sessions.name.placeholder')"
            required
            autofocus
          />

          <OnyxSelect
            v-model="selectedPreset"
            class="onyx-grid-span-4"
            :label="$t('estimations.units')"
            :list-label="$t('estimations.availableUnits')"
            :options="estimationUnitOptions"
            :message="`${t('value', 2)}: ${estimationUnits.join(', ')}`"
            hide-clear-icon
            required
          />

          <OnyxInput
            v-if="selectedPreset === 'custom'"
            class="onyx-grid-span-4"
            :label="$t('estimations.customUnits')"
            :model-value="customUnits.join(',')"
            placeholder="1,2,3..."
            required
            @change="handleCustomUnitChange"
          />
        </div>
      </section>

      <section class="section">
        <OnyxHeadline is="h2">{{ $t("stories.source.headline") }}</OnyxHeadline>
        <p class="text--medium">{{ $t("stories.source.description") }}</p>

        <div class="onyx-grid">
          <StorySourceCard
            class="onyx-grid-span-4"
            :headline="$t('stories.sources.github.headline')"
            :selected="session.source === 'github'"
            @select="session.source = 'github'"
          >
            <template #image>
              <OnyxIcon :icon="githubLogo" size="96px" />
            </template>

            {{ $t("stories.sources.github.description") }}
          </StorySourceCard>

          <StorySourceCard
            class="onyx-grid-span-4"
            :headline="$t('stories.sources.other.headline')"
            :button="{
              link: { href: bugs.url, target: '_blank' },
              label: $t('stories.sources.other.createFeatureRequest'),
              color: 'neutral',
              icon: iconExpandWindow,
            }"
          >
            <template #image>
              <OnyxIcon :icon="iconCircleHelp" size="96px" />
            </template>

            {{ $t("stories.sources.other.description") }}
          </StorySourceCard>
        </div>
      </section>

      <section v-if="session.source === 'github'" class="section">
        <OnyxHeadline is="h2">{{ $t("github.settings.headline") }}</OnyxHeadline>
        <p class="text--medium">{{ $t("github.settings.description") }}</p>

        <div class="onyx-grid">
          <GitHubRepositorySelect v-model="session.repository" class="onyx-grid-span-4" />
        </div>
      </section>
    </OnyxForm>

    <template #footer>
      <OnyxBottomBar>
        <OnyxButton
          :label="$t('sessions.create.new')"
          type="submit"
          :form="formId"
          :loading="isLoading"
          :icon="iconPlusSmall"
        />
      </OnyxBottomBar>
    </template>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: var(--onyx-density-xs);
}
</style>
