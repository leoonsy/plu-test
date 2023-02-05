export const useGeoLocation = async () => {
  const response = await new Promise<{
    lat: number;
    lon: number;
  }>((resolve, reject) => {
    const success = (position: GeolocationPosition) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      resolve({
        lat: latitude,
        lon: longitude,
      });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, reject);
    } else {
      reject();
    }
  });

  return response;
};
