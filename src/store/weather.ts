import { readLocationByCoords, readLocationsByTitle, readWeather } from '@/api';
import { computed, reactive } from 'vue';
import omit from 'lodash-es/omit';

export type Location = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export type Weather = {
  location: Location; // избыточность по памяти в угоду отсутствия поиска по возможному locationId
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
};

const state = reactive({
  locations: {} as Record<string, Location[]>,
  titlesList: [] as string[],
  weatherList: [] as Weather[],
});

const locationsList = computed(() => state.titlesList
  .map((title) => state.locations[title])
  .flat());
const weatherList = computed(() => state.weatherList);
const titlesList = computed(() => state.titlesList);

const extendLocation = (location: Awaited<ReturnType<typeof readLocationByCoords>>) => ({
  ...omit(location, 'local_names'),
  id: location.name + location.country + (location.state ?? ''),
});

const fetchLocationByCoords = async (lat: number, lon: number) => {
  const location = await readLocationByCoords(lat, lon);
  if (location) {
    const title = location.name;
    state.locations[title] = [extendLocation(location)];
    state.titlesList.unshift(title);
  }
};

const fetchLocationsByTitles = async (titles: string[]) => {
  // чтобы при обновлении не запрашивались снова координаты
  const newTitles: string[] = [];
  // обновленная хэш-таблица, чтобы не копились лишнее данные
  const newLocations: Record<string, Location[]> = {};

  titles.forEach((title) => {
    if (state.locations[title]) {
      newLocations[title] = state.locations[title];
    } else {
      newTitles.push(title);
    }
  });

  await Promise.all(newTitles.map(async (title) => {
    const locations = await readLocationsByTitle(title);
    newLocations[title] = locations.map((location) => extendLocation(location));
  }));

  state.locations = newLocations;
  state.titlesList = titles;
};

const fetchWeatherList = async () => {
  state.weatherList = await Promise.all(
    locationsList.value.map(async (location) => {
      const data = await readWeather(location.lat, location.lon);
      return {
        ...data,
        location,
      };
    }),
  );
};

export const useWeather = () => ({
  locations: locationsList,
  fetchLocations: fetchLocationsByTitles,
  fetchLocationByCoords,
  weatherList,
  fetchWeatherList,
  titlesList,
});
