<script setup lang="ts">
import type { Weather } from '@/store/weather';
import { computed } from 'vue';
import Description from './Description.vue';
import Descriptions from './Descriptions.vue';

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
}));
</script>

<template>
  <div :class="$style.card">
    <span :class="$style.header">
      {{ info.name }}, {{ info.country }}
    </span>

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
  </div>
</template>

<style module lang="scss">
.header {
  font-weight: bold;
}

.card {
  max-width: 17rem;
  padding: 0.8rem;
  border: 1px solid #ebebeb;
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
