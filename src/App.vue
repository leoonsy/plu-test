<script setup lang="ts">
const str = 'My Component!';
</script>

<template>
  <div :class="$style.div">
    {{ str }}
  </div>
</template>

<style module>
  .div {
    display: block;
    color: red;
  }
</style>
