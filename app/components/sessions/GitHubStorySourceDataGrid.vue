<script setup lang="ts">
import {
  createFeature,
  DataGridFeatures,
  OnyxAvatar,
  OnyxAvatarStack,
  OnyxBadge,
  OnyxDataGrid,
  OnyxTooltip,
  type ColumnConfig,
  type ColumnGroupConfig,
  type ColumnTypesFromFeatures,
} from "sit-onyx";

const props = defineProps<{
  repository: string;
}>();

const story = defineModel<PlanningStory>();

const { t } = useI18n();
const pageSize = 15;

const paginationState = ref<DataGridFeatures.PaginationState>({
  current: 1,
  pages: 1,
  pageSize,
});

const filterState = ref<DataGridFeatures.FilterState<GitHubIssue>>({});

const { issues, loading, total, pages } = useGitHubIssues({
  repository: toRef(props, "repository"),
  pageSize,
  page: computed(() => paginationState.value.current),
  filters: filterState,
});

// sync data grid pagination state with GitHub API data
watch(pages, (newTotalPages) => {
  paginationState.value = { ...paginationState.value, pages: newTotalPages };
});

const columns = computed<ColumnConfig<GitHubIssue, ColumnGroupConfig, CustomColumnTypes>[]>(() => [
  { key: "number", label: t("github.issues.number"), width: "max-content" },
  { key: "title", label: t("github.issues.title") },
  {
    key: "labels",
    label: t("github.issues.label", 2),
    type: "labels",
    width: "max-content",
  },
  {
    key: "assignees",
    label: t("github.issues.assignee", 2),
    type: "assignees",
    width: "max-content",
  },
]);

const withPagination = DataGridFeatures.usePagination({ paginationState });
const withFiltering = DataGridFeatures.useFiltering<GitHubIssue>({
  filterState,
  enabled: false,
  columns: {
    number: { enabled: true },
    title: { enabled: true },
    labels: { enabled: true },
  },
});

const selectedRowId = computed({
  get: () => story.value?.id,
  set: (newId) => {
    const issue = issues.value.find((issue) => issue.id === newId);

    if (!issue) {
      story.value = undefined;
      return;
    }

    story.value = {
      id: issue.id,
      title: issue.title,
      content: issue.body_html,
    };
  },
});

const withSingleSelect = useSingleSelect<GitHubIssue>({ state: selectedRowId });

type CustomColumnTypes = ColumnTypesFromFeatures<typeof withCustomTypes>;
const withCustomTypes = createFeature(() => ({
  name: Symbol("githubIssues"),
  typeRenderer: {
    assignees: DataGridFeatures.createTypeRenderer<object, GitHubIssue>({
      cell: {
        component: ({ row }) => {
          return h(OnyxAvatarStack, () =>
            row.assignees.map((assignee) =>
              h(OnyxAvatar, { fullName: assignee.login, src: assignee.avatar_url, size: "32px" }),
            ),
          );
        },
      },
    }),
    labels: DataGridFeatures.createTypeRenderer<object, GitHubIssue>({
      cell: {
        component: ({ row }) => {
          return h(
            "div",
            { class: "labels" },
            row.labels.map((label) => {
              return h(
                OnyxTooltip,
                { text: label.description },
                {
                  default: ({ trigger }: { trigger: object }) =>
                    h(
                      OnyxBadge,
                      {
                        ...trigger,
                        density: "compact",
                        style: { "--onyx-badge-background-color": `#${label.color}` },
                      },
                      () => label.name,
                    ),
                },
              );
            }),
          );
        },
      },
    }),
  },
}));

const features = [withPagination, withFiltering, withSingleSelect, withCustomTypes];
</script>

<template>
  <!-- async is set to true, so that the features data transformation is disabled -->
  <OnyxDataGrid
    :headline="{ text: $t('github.issues.issue', 2), rowCount: total }"
    async
    :columns
    :data="issues"
    :features
    :skeleton="loading"
  />
</template>

<style lang="scss" scoped>
:deep(td) {
  align-content: center;
}

:deep(.labels) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--onyx-density-2xs);
}
</style>
