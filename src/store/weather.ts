import { readLocationByTitle, readWeather } from '@/api';
import { computed, reactive } from 'vue';
import omit from 'lodash-es/omit';

export type Location = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export type Weather = {
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level:number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  id: number;
  name: string;
  country: string;
};

const state = reactive({
  locations: {} as Record<string, Location[]>,
  titles: ['London', 'Moscow, RU'] as string[],
  weatherList: [] as Weather[],
});

const locations = computed(() => state.titles.map((title) => state.locations[title]).flat());
const weatherList = computed(() => state.weatherList);

const fetchLocations = async (titles: string[]) => {
  const newTitles: string[] = [];
  const newLocations: Record<string, Location[]> = {};

  titles.forEach((title) => {
    if (state.locations[title]) {
      newLocations[title] = state.locations[title];
    } else {
      newTitles.push(title);
    }
  });

  await Promise.all(newTitles.map(async (title) => {
    const location = await readLocationByTitle(title);
    // не поддерживаем мультиязычность
    newLocations[title] = omit(location, 'local_names');
  }));

  state.locations = newLocations;
  state.titles = titles;
};

const fetchWeatherList = async () => {
  state.weatherList = await Promise.all(
    locations.value.map(async (location) => {
      const data = await readWeather(location.lat, location.lon);
      return {
        ...data,
        name: location.name,
        country: location.country,
      };
    }),
  );
};

export const useWeather = () => ({
  locations,
  fetchLocations,
  weatherList,
  fetchWeatherList,
});
