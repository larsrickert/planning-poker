<script lang="ts" setup>
import { iconPlusSmall } from "@sit-onyx/icons";
import JoinCodeForm from "~/components/dashboard/JoinCodeForm.vue";
import SessionCard from "~/components/dashboard/SessionCard.vue";

definePageMeta({ layout: false });

const handleJoinPlanning = async (code: string) => {
  await navigateTo(`/sessions/join/${code}`, { external: true });
};

const { user } = useUserSession();
const { data: sessions } = await useFetch("/api/sessions", {
  watch: [user],
});
</script>

<template>
  <NuxtLayout name="default">
    <template #hero>
      <div class="onyx-grid">
        <OnyxHeadline is="h1" class="onyx-grid-span-8">{{ $t("app.name") }}</OnyxHeadline>

        <p class="hero__description text--medium onyx-grid-span-8">
          {{ $t("home.hero.description") }}
        </p>
      </div>
    </template>

    <div class="sections">
      <section class="section">
        <OnyxHeadline is="h2"> {{ $t("home.gettingStarted") }} </OnyxHeadline>

        <div class="onyx-grid">
          <DashboardCard
            class="onyx-grid-span-4"
            :headline="$t('sessions.join.headline')"
            :description="$t('sessions.join.description')"
          >
            <JoinCodeForm @submit="handleJoinPlanning" />
          </DashboardCard>

          <DashboardCard
            class="onyx-grid-span-4"
            :headline="$t('sessions.create.headline')"
            :description="$t('sessions.create.description')"
          >
            <OnyxButton
              :label="$t('sessions.create.new')"
              :icon="iconPlusSmall"
              link="/sessions/new"
            />
          </DashboardCard>
        </div>
      </section>

      <section class="section">
        <OnyxHeadline is="h2">
          {{ $t("sessions.yours") }}
          <span v-if="sessions?.length" class="text--soft">({{ sessions.length }})</span>
        </OnyxHeadline>

        <div v-if="sessions?.length" class="onyx-grid">
          <SessionCard
            v-for="session in sessions"
            :key="session.id"
            class="onyx-grid-span-4"
            :session
          />
        </div>

        <OnyxEmpty v-else>{{ $t("sessions.empty") }}</OnyxEmpty>
      </section>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.hero {
  &__description {
    white-space: pre-line;
  }
}

.sections {
  display: flex;
  flex-direction: column;
  gap: var(--onyx-density-3xl);
}

.section {
  display: flex;
  flex-direction: column;
  gap: var(--onyx-density-xs);
}
</style>
