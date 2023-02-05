<template>
  <div :class="$style.descriptions">
    <slot />
  </div>
</template>

<style module lang="scss">
.descriptions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.2rem;
}
</style>
