export type UseGitHubIssuesOptions = {
  repository: MaybeRef<string>;
  page: Ref<number>;
  pageSize: number;
  filters?: Ref<GitHubIssueFilters>;
};

export type GitHubIssue = {
  id: number;
  number: number;
  html_url: string;
  title: string;
  assignees: GitHubAssignee[];
  body_html?: string;
  labels: GitHubLabel[];
};

export type GitHubAssignee = {
  /**
   * User name.
   */
  login: string;
  avatar_url: string;
};

export type GitHubLabel = {
  color: string;
  name: string;
  description: string;
};

type GitHubIssueSearchResult = {
  items: GitHubIssue[];
  total_count: number;
  incomplete_results?: boolean;
};

export type GitHubIssueFilters = Partial<{
  number: string;
  title: string;
  labels: string;
}>;

export const useGitHubIssues = (options: UseGitHubIssuesOptions) => {
  const loading = ref(false);

  /**
   * @see https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
   */
  const state = computedAsync(
    async () => {
      const searchParts = ["is:issue", "state:open", `repo:${toValue(options.repository)}`];

      // check filters
      if (options.filters?.value.title) {
        searchParts.push(`in:title ${options.filters.value.title}`);
      }
      if (options.filters?.value.number) {
        searchParts.push(`#${options.filters.value.number.replace("#", "")}`);
      }
      if (options.filters?.value.labels) {
        searchParts.push(`label:${options.filters.value.labels}`);
      }

      const issues = await $fetch<GitHubIssueSearchResult>("https://api.github.com/search/issues", {
        query: {
          per_page: options.pageSize,
          page: toValue(options.page),
          q: searchParts.join(" "),
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
          Accept: "application/vnd.github.html+json",
        },
      });

      return issues;
    },
    undefined,
    {
      evaluating: loading,
    },
  );

  const issues = computed(() => state.value?.items ?? []);
  const total = computed(() => state.value?.total_count ?? 0);

  const pages = computed(() => Math.ceil(total.value / options.pageSize));

  return { issues, loading, total, pages };
};
