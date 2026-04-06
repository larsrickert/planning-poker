<script lang="ts" setup>
const props = defineProps<{
  session: Pick<PlanningSession, "source" | "repository" | "story">;
}>();

const emit = defineEmits<{
  "update:story": [story?: PlanningStory];
}>();

const selectedStory = computed({
  get: () => props.session.story ?? undefined,
  set: (newValue) => emit("update:story", newValue),
});
</script>

<template>
  <OnyxAccordion type="card">
    <OnyxAccordionItem value="story">
      <template #header> {{ $t("stories.select") }}</template>

      <GitHubStorySourceDataGrid
        v-if="props.session.source === 'github' && props.session.repository"
        v-model="selectedStory"
        :repository="props.session.repository"
      />
    </OnyxAccordionItem>
  </OnyxAccordion>
</template>
