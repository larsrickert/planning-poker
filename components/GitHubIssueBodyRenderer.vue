<script lang="ts" setup>
import { OnyxEmpty, OnyxHeadline, OnyxLink } from "sit-onyx";
import type { GitHubIssue } from "~/types/github";

const props = defineProps<{
  issue: GitHubIssue;
}>();
</script>

<template>
  <div class="issue">
    <OnyxHeadline is="h2" class="issue__headline">
      <OnyxLink :href="props.issue.html_url" target="_blank" :with-external-icon="false">
        #{{ props.issue.number }}
      </OnyxLink>
      {{ props.issue.title }}
    </OnyxHeadline>

    <OnyxEmpty v-if="!props.issue.body_html">
      {{ $t("issues.emptyBody") }}
    </OnyxEmpty>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="issue__body" v-html="props.issue.body_html" />
  </div>
</template>

<style lang="scss" scoped>
@use "sit-onyx/style.css";

.issue {
  padding: var(--onyx-spacing-md);
  border: var(--onyx-1px-in-rem) solid var(--onyx-color-base-neutral-300);
  background-color: var(--onyx-color-base-neutral-100);
  border-radius: var(--onyx-radius-md);

  &__headline {
    margin-bottom: var(--onyx-spacing-md);
  }

  &__body {
    @each $headline in (h1, h2, h3, h4, h5, h6) {
      :deep(#{$headline}) {
        @extend .onyx-headline;
        @extend .onyx-headline--#{$headline};
        margin-top: var(--onyx-spacing-md);
        margin-bottom: var(--onyx-spacing-xs);
      }
    }

    :deep(code),
    :deep(pre) {
      background-color: var(--onyx-color-base-neutral-200);
      padding: var(--onyx-spacing-4xs) var(--onyx-spacing-3xs);
      border-radius: var(--onyx-radius-xs);
      font-size: 0.8125rem;
      line-height: 1rem;
      font-family: var(--onyx-font-family-mono);
      margin: var(--onyx-spacing-md) 0;
    }

    :deep(img) {
      margin: var(--onyx-spacing-md) 0;
    }

    // copied from OnyxLink
    :deep(a) {
      display: inline-flex;
      color: var(--onyx-color-text-icons-primary-intense);

      &:focus-visible {
        color: var(--onyx-color-text-icons-primary-intense);
        border-radius: var(--onyx-radius-sm);
        outline: var(--onyx-1px-in-rem) solid var(--onyx-color-base-primary-300);
      }

      &:active {
        color: var(--onyx-color-text-icons-primary-bold);
      }

      &:visited {
        color: var(--onyx-color-text-icons-primary-bold);

        &:hover {
          color: var(--onyx-color-text-icons-primary-intense);
        }
      }
    }
  }
}
</style>
