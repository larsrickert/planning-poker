<script lang="ts" setup>
const props = defineProps<{
  session: EnrichedPlanningSession;
}>();
</script>

<template>
  <OnyxCard class="card" :link="`/sessions/${props.session.id}`">
    <OnyxHeadline is="h3" class="card__headline">{{ props.session.name }}</OnyxHeadline>

    <div class="card__details">
      <div v-if="props.session.repository" class="detail">
        <span class="detail__label">{{ $t("repositories.repository") }}</span>
        <span class="detail__value">
          {{ props.session.repository }}
        </span>
      </div>

      <div class="detail">
        <span class="detail__label">{{ $t("users.user", 2) }}</span>
        <span class="detail__value">
          <OnyxAvatarStack>
            <OnyxAvatar
              v-for="user in props.session.users"
              :key="user.id"
              :full-name="user.name"
              :src="user.picture ?? undefined"
              size="24px"
            />
          </OnyxAvatarStack>
        </span>
      </div>
    </div>
  </OnyxCard>
</template>

<style lang="scss" scoped>
.card {
  &:hover {
    border-color: var(--onyx-color-component-border-primary);

    .card__headline {
      color: var(--onyx-color-text-icons-primary-intense);
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-density-xs);
  }
}

.detail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--onyx-density-xs);

  &__label {
    color: var(--onyx-color-text-icons-neutral-soft);
    font-size: var(--onyx-font-size-sm);
    line-height: var(--onyx-font-line-height-sm);
  }

  &__value {
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-density-2xs);
  }
}
</style>
