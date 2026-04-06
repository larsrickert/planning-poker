<script lang="ts" setup>
import type { Nullable, OnyxAvatarProps, SelectOption } from "sit-onyx";

type GitHubRepository = {
  id: number;
  full_name: string;
  owner: GitHubOwner;
};

export type GitHubOwner = {
  avatar_url: string;
  login: string;
};

const value = defineModel<Nullable<string>>();

const search = ref("");
const debouncedSearch = useDebounce(search, 500);
const isLoading = ref(false);
const error = ref<Error>();

const searchResults = computedAsync<{
  items?: GitHubRepository[];
}>(
  async () => {
    const searchTerm = debouncedSearch.value.trim();
    if (!searchTerm) return [];

    const response = await fetch(`https://api.github.com/search/repositories?q=${searchTerm}`);
    error.value = undefined;
    return await response.json();
  },
  undefined,
  {
    evaluating: isLoading,
    onError: (e) => {
      error.value = e as Error;
    },
  },
);

const options = computed(() => {
  return (
    searchResults.value?.items?.map<SelectOption<string>>((item) => ({
      label: item.full_name,
      value: item.full_name,
      _raw: item,
    })) ?? []
  );
});

const getAvatarProps = (option: SelectOption): OnyxAvatarProps => {
  const { owner } = (option as typeof option & { _raw: GitHubRepository })._raw;
  return {
    fullName: owner.login,
    src: owner.avatar_url,
  };
};
</script>

<template>
  <OnyxSelect
    v-model="value"
    v-model:search-term="search"
    :label="$t('repositories.repository')"
    :list-label="$t('repositories.available')"
    with-search
    :options
    :loading="isLoading"
    truncation="multiline"
    :value-label="value ?? ''"
    :custom-error="error?.message"
    :show-error="error ? true : undefined"
    required
  >
    <template #option="option">
      <OnyxAvatar v-bind="getAvatarProps(option)" size="32px" />
      {{ option.label }}
    </template>
  </OnyxSelect>
</template>

<style lang="scss" scoped>
:deep(.onyx-select-option > span) {
  display: flex;
  align-items: center;
  gap: var(--onyx-density-sm);
}
</style>
