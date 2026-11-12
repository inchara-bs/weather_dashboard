const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("weatherResult");

const weatherDescriptions = {
    0: "Clear Sky ☀️",
    1: "Mainly Clear 🌤️",
    2: "Partly Cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    48: "Foggy 🌫️",
    51: "Light Drizzle 🌦️",
    61: "Rainy 🌧️",
    71: "Snowy ❄️",
    80: "Rain Showers 🌧️",
    95: "Thunderstorm ⛈️"
};

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) return;

    result.innerHTML = "<p>Loading weather...</p>";

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const location = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather.");
        }

        const weatherData = await weatherResponse.json();
        const weather = weatherData.current;

        const description =
            weatherDescriptions[weather.weather_code] ||
            "Weather conditions unavailable";

        result.innerHTML = `
            <h2>${location.name}, ${location.country}</h2>

            <div class="temperature">
                ${Math.round(weather.temperature_2m)}°C
            </div>

            <h3>${description}</h3>

            <div class="details">
                <p>Feels Like: ${weather.apparent_temperature}°C</p>
                <p>Humidity: ${weather.relative_humidity_2m}%</p>
                <p>Wind Speed: ${weather.wind_speed_10m} km/h</p>
            </div>
        `;
    } catch (error) {
        result.innerHTML = `
            <p class="error">${error.message}</p>
        `;
    }
});
