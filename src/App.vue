<script setup lang="ts">
import { useWeather } from '@/store/weather';
import WeatherCard from '@/components/WeatherCard.vue';
import { useGeoLocation } from '@/composables/useGeoLocation';

const {
  weatherList, fetchWeatherList, titlesList, fetchLocationByCoords,
} = useWeather();

(async () => {
  if (titlesList.value.length) {
    return;
  }

  try {
    const { lat, lon } = await useGeoLocation();
    await fetchLocationByCoords(lat, lon);
    await fetchWeatherList();
  } catch {
    // handle error
  }
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
