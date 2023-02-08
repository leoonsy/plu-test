<script setup lang="ts">
defineProps<{
  ico?: string;
  label?: string;
}>();
</script>

<template>
  <div :class="$style.description">
    <img
      v-if="ico"
      :src="ico"
      alt="icon"
      :class="$style.icon"
    />

    <span
      v-if="label"
      :class="$style.label"
      v-text="label"
    />

    <slot />
  </div>
</template>

<style module>
.icon {
  width: 1rem;
  margin-right: 0.2rem;
  vertical-align: top;
}

.label::after {
  content: ": ";
}
</style>
