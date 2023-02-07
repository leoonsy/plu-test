<script setup lang="ts">
import type { Weather } from '@/store/weather';
import { computed } from 'vue';
import Description from './Description.vue';
import Descriptions from './Descriptions.vue';
import BaseCard from './BaseCard.vue';

const props = defineProps<{
  weather: Weather;
}>();

const ucFirst = (str: string) => str[0].toUpperCase() + str.slice(1);

const getWindDirection = (angle: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(angle / 45) % 8];
};

const info = computed(() => ({
  ...props.weather,
  temp: Math.round(props.weather.main.temp),
  feelsLike: Math.round(props.weather.main.feels_like),
  description: ucFirst(props.weather.weather[0].description),
  icon: props.weather.weather[0].icon,
  wind: {
    ...props.weather.wind,
    speed: props.weather.wind.speed.toFixed(1),
    direction: getWindDirection(props.weather.wind.deg),
  },
  visibility: (props.weather.visibility / 1000).toFixed(1),
  location: props.weather.location,
}));
</script>

<template>
  <BaseCard>
    <template #title>
      {{ info.location.name }},
      {{ info.location.country }}
      <div v-if="info.location.state">
        {{ info.location.state }}
      </div>
    </template>

    <div :class="$style.temp">
      <img
        :src="`http://openweathermap.org/img/wn/${info.icon}@2x.png`"
        alt="icon"
      />

      <span v-text="`${info.temp}°C`" />
    </div>

    Feels like {{ info.feelsLike }}°C. {{ info.description }}

    <Descriptions :class="$style.descriptions">
      <Description :ico="require('@/assets/direction.svg')">
        {{ info.wind.speed }}m/s {{ info.wind.direction }}
      </Description>

      <Description :ico="require('@/assets/pressure.svg')">
        {{ info.main.pressure }}hPa
      </Description>

      <Description label="Humidity">
        {{ info.main.humidity }}%
      </Description>

      <Description label="Visibility">
        {{ info.visibility }}km
      </Description>
    </Descriptions>
  </BaseCard>
</template>

<style module lang="scss">
.header {
  font-weight: bold;
}

.card {
  padding: 0.8rem;
  box-shadow: rgb(99 99 99 / 20%) 0 0.125rem 0.5rem 0;
}

.temp {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  & span {
    font-size: 2rem;
    font-weight: bold;
  }
}

.descriptions {
  margin-top: 1rem;
}
</style>
