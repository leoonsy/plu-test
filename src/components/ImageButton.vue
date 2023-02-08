<script setup lang="ts">
withDefaults(defineProps<{
  type: 'button' | 'submit';
}>(), {
  type: 'submit',
});
</script>

<template>
  <button
    :type="type"
    :class="$style.button"
  >
    <slot />
  </button>
</template>

<style module lang="scss">
.button {
  flex: 0 0 auto;
  width: 1.7rem;
  padding: 0.2rem;
  cursor: pointer;
  background-color: transparent;
  border: none;

  img {
    width: 100%;
  }
}
</style>
