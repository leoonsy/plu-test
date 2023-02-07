<script setup lang="ts">
// для уменьшения сборки можно было реализовать drag-drop на html 5, но браузеры не оч поддерживают
import { ref, computed } from 'vue';
import draggable from 'vuedraggable-es';
import BaseCard from './BaseCard.vue';
import ImageButton from './ImageButton.vue';

const props = defineProps<{
  titles: string[];
}>();

// draggable требует использования объекта для item-key
const titles = ref(props.titles.map((title) => ({ title })));
const plainTitles = computed(() => titles.value.map((data) => data.title));

const drag = ref(false);

const newTitle = ref('');

const add = () => {
  if (!titles.value.find((data) => data.title === newTitle.value)) {
    titles.value.push({ title: newTitle.value });
  }
};

const remove = (title: string) => {
  titles.value = titles.value.filter((data) => data.title !== title);
};

/*
можно было бы генерировать событие с данными, но сохранение происходит по нажатию
на крестик, компонент которого лежит не тут. А располагать его тут тоже неверно -
вдруг нужно будет вынести его за пределы карточки. Либо можно было напрямую сразу менять
titles в store, но тогда компонент не будет чистым, что не круто.
*/
defineExpose({ titles: plainTitles });
</script>

<template>
  <BaseCard>
    <template #title>
      Settings
    </template>

    <draggable
      v-model="titles"
      tag="transition-group"
      :component-data="{
        tag: 'ul',
        name: !drag ? 'flip-list' : null,
      }"
      :class="$style.list"
      item-key="title"
      :animation="200"
      :handle="`.${$style.burger}`"
      :ghost-class="$style.ghost"
      @start="drag = true"
      @end="drag = false"
    >
      <template #item="{ element: { title } }">
        <li :class="$style.item">
          <ImageButton
            :class="$style.burger"
            type="button"
          >
            <img src="@/assets/burger.svg" alt="burger" />
          </ImageButton>

          <span v-text="title" />
          <ImageButton
            :class="$style.remove"
            type="button"
            @click="remove(title)"
          >
            <img src="@/assets/remove.svg" alt="remove" />
          </ImageButton>
        </li>
      </template>
    </draggable>

    <label
      :class="$style.label"
      for="location-input"
      v-text="'Add location:'"
    />

    <form
      :class="$style.add"
      @submit.prevent="add"
    >
      <input
        id="location-input"
        v-model="newTitle"
        type="text"
        :class="$style.input"
      />

      <ImageButton
        :class="$style.submit"
        type="submit"
      >
        <img src="@/assets/enter.svg" alt="add location" />
      </ImageButton>
    </form>
  </BaseCard>
</template>

<style module lang="scss">
.list {
  padding: 0;
  margin: 1rem 0 2rem;
}

.item {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  padding: 0.3rem;
  overflow: auto;
  background: #ededed;

  &:not(:first-child) {
    margin-top: 0.8rem;
  }
}

.remove {
  margin-left: auto;
}

.burger {
  width: 1.8rem;
}

.ghost {
  background: #c8ebfb;
  opacity: 0.5;
}

.label {
  font-weight: bold;
}

.add {
  display: flex;
  align-items: center;
}

.input {
  min-width: 3rem;
  padding: 0.3rem 0.4rem;
  font-size: 1.125rem;
  background-color: #fff;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
}

.submit {
  flex: 0 0 2.3rem;
  margin-left: 0.2rem;
}
</style>
