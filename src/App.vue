<script setup lang="ts">
import { useWeather } from '@/store/weather';
import WeatherCard from '@/components/WeatherCard.vue';
import SettingsCard from '@/components/SettingsCard.vue';
import ImageButton from '@/components/ImageButton.vue';
import { useGeoLocation } from '@/composables/useGeoLocation';
import { ref, watch } from 'vue';

const {
  weatherList, fetchWeatherList, titlesList, fetchLocationByCoords, fetchLocations,
} = useWeather();

const isSettings = ref(false);
// причины не использовать события или store см. в компоненте SettingsCard
const settingsElement = ref(null as unknown as InstanceType<typeof SettingsCard>);

const fetchUserLocation = async () => {
  if (titlesList.value.length) {
    await fetchWeatherList();
    return;
  }

  try {
    const { lat, lon } = await useGeoLocation();
    await fetchLocationByCoords(lat, lon);
    await fetchWeatherList();
  } catch {
    // handle error
  }
};
fetchUserLocation();

const fetchLocationsAndWeather = async (titles: string[]) => {
  await fetchLocations(titles);
  await fetchWeatherList();
};

const toggleSettings = () => {
  isSettings.value = !isSettings.value;
};

watch(isSettings, () => {
  if (!isSettings.value) {
    fetchLocationsAndWeather(settingsElement.value.titles);
  }
});
</script>

<template>
  <div :class="$style.root">
    <SettingsCard
      v-if="isSettings"
      ref="settingsElement"
      :titles="titlesList"
    />

    <template v-else>
      <div
        v-if="!weatherList.length"
        :class="$style.access"
      >
        This is weather widgets. Give access to the location or customize the list yourself.
      </div>

      <WeatherCard
        v-for="weather of weatherList"
        :key="weather.location.id"
        :weather="weather"
        :class="$style.card"
      />
    </template>

    <ImageButton
      :class="$style.toggle"
      type="button"
      @click="toggleSettings"
    >
      <img
        :src="isSettings ? require(`@/assets/cross.svg`) : require('@/assets/settings.svg')"
        alt="settings"
      />
    </ImageButton>
  </div>
</template>

<style module lang="scss">
.root {
  position: relative;
  min-width: 10rem;
  max-width: 17rem;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

.card:not(:first-child) {
  margin-top: 0.7rem;
}

.toggle {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
}

.access {
  margin-right: 2.5rem;
}
</style>
