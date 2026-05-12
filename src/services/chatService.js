const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

function isApiKeyConfigured() {
  return API_KEY.trim().length > 0;
}

function getCityFromMessage(message) {
  return message.split('in')[1]?.trim();
}

async function getWeatherReply(city) {
  if (!isApiKeyConfigured()) {
    return 'OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY to .env and restart npm run dev.';
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`,
  );
  const data = await response.json();

  if (!response.ok) {
    return data.message
      ? `Weather request failed: ${data.message}`
      : 'Weather request failed. Please check the city name and API key.';
  }

  return `Weather in ${city}: ${Math.round(data.main.temp)}°C`;
}

async function getAqiReply(city) {
  if (!isApiKeyConfigured()) {
    return 'OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY to .env and restart npm run dev.';
  }

  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`,
  ).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Geocoding request failed');
    }
    return data;
  });

  if (!geo.length) {
    return `I could not find a location named ${city}.`;
  }

  const aqi = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${geo[0].lat}&lon=${geo[0].lon}&appid=${API_KEY}`,
  ).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'AQI request failed');
    }
    return data;
  });

  const aqiValue = aqi.list[0].main.aqi;
  const aqiText = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor',
  };

  return `AQI in ${city}: ${aqiValue} (${aqiText[aqiValue]})`;
}

export async function getBotReply(input) {
  const text = input.toLowerCase();

  try {
    if (text.includes('date')) {
      return `Today is ${new Date().toDateString()}`;
    }

    if (text.includes('weather')) {
      const city = getCityFromMessage(input);
      if (!city) return 'Please write city name like: weather in Delhi';

      return getWeatherReply(city);
    }

    if (text.includes('aqi')) {
      const city = getCityFromMessage(input);
      if (!city) return 'Please write city name like: AQI in Mumbai';

      return getAqiReply(city);
    }

    return 'Sorry, I only support date, weather and AQI.';
  } catch (error) {
    return error.message || 'Something went wrong. Please try again.';
  }
}
