type Config = {
  url: string;
  params?: any;
};

const BASE_URL = 'https://api.openweathermap.org';
const LIMIT = 5;

const request = async <T = unknown>({ url, params }: Config) => {
  const response = await fetch(`${BASE_URL}/${url}?${new URLSearchParams({
    ...params,
    appid: process.env.API_KEY,
  })}`);

  if (response.ok) {
    return response.json() as Promise<T>;
  }

  throw new Error(response.statusText);
};

type Location = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  local_names: Record<string, string>;
  state?: string;
};

export const readLocationsByTitle = async (title: string) => (
  request<Location[]>({
    url: 'geo/1.0/direct',
    params: {
      q: title,
      limit: LIMIT,
    },
  })
);

export const readLocationByCoords = async (lat: number, lon: number) => {
  const response = await request<Location[]>({
    url: 'geo/1.0/reverse',
    params: {
      lat,
      lon,
      limit: 1,
    },
  });

  return response[0];
};

export const readWeather = async (lat: number, lon: number) => (
  request<{
    coord: {
      lon: number;
      lat: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    base: string;
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
    dt: number;
    timezone: number;
    id: number;
    name: string;
  }>({
    url: 'data/2.5/weather',
    params: {
      lat,
      lon,
      units: 'metric',
    },
  })
);
