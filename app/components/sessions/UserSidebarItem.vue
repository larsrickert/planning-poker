<script lang="ts" setup>
const props = defineProps<{
  user: EnrichedUser;
}>();
</script>

<template>
  <OnyxSidebarItem>
    <OnyxAvatar :full-name="props.user.name" :src="props.user.picture ?? undefined" size="32px" />
    {{ props.user.name }}

    <div v-if="props.user.estimation" class="trailing onyx-density-compact">
      <OnyxTag
        v-if="typeof props.user.estimation === 'number'"
        :label="props.user.estimation.toString()"
      />
      <OnyxTag v-else :label="$t('estimations.estimated')" color="success" />
    </div>
  </OnyxSidebarItem>
</template>

<style lang="scss" scoped>
.trailing {
  margin-left: auto;
}
</style>
