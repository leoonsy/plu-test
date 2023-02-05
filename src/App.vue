<script setup lang="ts">
import { useWeather } from '@/store/weather';
import WeatherCard from '@/components/WeatherCard.vue';

const {
  weatherList, fetchLocations, fetchWeatherList,
} = useWeather();

(async () => {
  await fetchLocations(['London', 'Moscow, RU']);
  await fetchWeatherList();
})();

</script>

<template>
  <WeatherCard
    v-for="weather of weatherList"
    :key="weather.id"
    :weather="weather"
    :class="$style.card"
  />
</template>

<style module>
  .card:not(:first-child) {
    margin-top: 0.7rem;
  }
</style>
