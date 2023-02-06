<template>
  <div :class="$style.settings">
    <div :class="$style.header">
      <slot name="title" />
    </div>

    <slot />
  </div>
</template>

<style module>
.header {
  margin-right: 2rem;
  font-weight: bold;
}

.settings {
  padding: 0.8rem;
  box-shadow: rgb(99 99 99 / 20%) 0 0.125rem 0.5rem 0;
}
</style>
