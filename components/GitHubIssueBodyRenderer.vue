<script lang="ts" setup>
import { renderToString } from "@vue/server-renderer";
import { computedAsync } from "@vueuse/core";
import { OnyxHeadline, OnyxLink } from "sit-onyx";
import type { VNode } from "vue";
import type { GitHubIssue } from "~/types/github";

const props = defineProps<{
  issue: GitHubIssue;
}>();

const REPLACEMENTS = [
  {
    search: /<h1.*>(.*)<\/h1>/g,
    replace: (content) => h(OnyxHeadline, { is: "h1" }, () => content[0]),
  },
  {
    search: /<h2.*>(.*)<\/h2>/g,
    replace: (content) => h(OnyxHeadline, { is: "h2" }, () => content[0]),
  },
  {
    search: /<h3.*>(.*)<\/h3>/g,
    replace: (content) => h(OnyxHeadline, { is: "h3" }, () => content[0]),
  },
  {
    search: /<h4.*>(.*)<\/h4>/g,
    replace: (content) => h(OnyxHeadline, { is: "h4" }, () => content[0]),
  },
  {
    search: /<h5.*>(.*)<\/h5>/g,
    replace: (content) => h(OnyxHeadline, { is: "h5" }, () => content[0]),
  },
  {
    search: /<h6.*>(.*)<\/h6>/g,
    replace: (content) => h(OnyxHeadline, { is: "h6" }, () => content[0]),
  },
  {
    search: /<a.*href="(\S*)".*>(.*)<\/a>/g,
    replace: (matches) => {
      const href = matches[0] as string;

      if (href.startsWith("https://private-user-images.githubusercontent.com")) {
        return h("img", { src: href });
      }
      return h(OnyxLink, { href }, () => matches[1]);
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] satisfies { search: RegExp; replace: (matches: any[]) => VNode }[];

const html = computedAsync(async () => {
  let replacements: { search: string; index: number; replace: VNode }[] = [];

  REPLACEMENTS.forEach((replacement) => {
    props.issue.body_html?.replaceAll(replacement.search, (match, ...groups) => {
      replacements.push({
        search: match,
        replace: replacement.replace(groups),
        index: groups.at(-2),
      });
      return match;
    });
  });

  // replacements must be sorted so the components are placed in the correct order/positions
  replacements = replacements.sort((a, b) => a.index - b.index);

  const vnodes = replacements
    .reduce(
      (acc, i) => {
        const html = acc.at(-1) as string;
        const index = html.indexOf(i.search) ?? 0;
        const lastIndex = index + i.search.length;
        return [
          ...acc.slice(0, acc.length - 1),
          html?.substring(0, index),
          i.replace,
          html?.substring(lastIndex),
        ];
      },
      [props.issue.body_html] as (string | VNode)[],
    )
    .filter((i) => !!i);

  // render vnodes as HTML strings
  for (let index = 0; index < vnodes.length; index++) {
    if (typeof vnodes[index] !== "string") {
      vnodes[index] = await renderToString(vnodes[index] as VNode);
    }
  }

  return vnodes.join("\n");
}, "");
</script>

<template>
  <div class="issue">
    <OnyxHeadline is="h2" class="issue__headline">
      <OnyxLink :href="props.issue.html_url" target="_blank" :with-external-icon="false">
        #{{ props.issue.number }}
      </OnyxLink>
      {{ props.issue.title }}
    </OnyxHeadline>

    <div class="issue__body" v-html="html" />
  </div>
</template>

<style lang="scss" scoped>
.issue {
  padding: var(--onyx-spacing-md);
  border: var(--onyx-1px-in-rem) solid var(--onyx-color-base-neutral-300);
  background-color: var(--onyx-color-base-neutral-100);
  border-radius: var(--onyx-radius-md);

  &__headline {
    margin-bottom: var(--onyx-spacing-md);
  }

  &__body {
    :deep(.onyx-headline) {
      margin-top: var(--onyx-spacing-md);
      margin-bottom: var(--onyx-spacing-xs);
    }

    :deep(code),
    :deep(pre) {
      background-color: var(--onyx-color-base-neutral-300);
      padding: var(--onyx-spacing-4xs) var(--onyx-spacing-3xs);
      border-radius: var(--onyx-radius-xs);
      font-size: 0.8125rem;
      line-height: 1rem;
      font-family: var(--onyx-font-family-mono);
    }
  }
}
</style>
