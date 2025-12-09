document.getElementById("searchBtn").addEventListener("click", getWeather);


function getWeatherIcon(code) {
    if (code === 0) return "https://img.icons8.com/color/48/000000/sun.png"; 
    if (code === 1 || code === 2) return "https://img.icons8.com/color/48/000000/partly-cloudy-day.png"; // Mainly clear, partly cloudy
    if (code === 3) return "https://img.icons8.com/color/48/000000/cloud.png"; 
    if (code >= 45 && code <= 48) return "https://img.icons8.com/color/48/000000/fog.png"; // Fog
    if (code >= 51 && code <= 67) return "https://img.icons8.com/color/48/000000/rain.png"; // Drizzle / Rain
    if (code >= 71 && code <= 77) return "https://img.icons8.com/color/48/000000/snow.png"; // Snow
    if (code >= 80 && code <= 82) return "https://img.icons8.com/color/48/000000/rain.png"; // Rain showers
    if (code >= 95 && code <= 99) return "https://img.icons8.com/color/48/000000/storm.png"; // Thunderstorm
    return "https://img.icons8.com/color/48/000000/question-mark.png"; 
}

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    const loading = document.getElementById("loading");
    const result = document.getElementById("weatherResult");

    errorMsg.textContent = "";
    errorMsg.classList.add("hidden");
    result.classList.add("hidden");

    if (city === "") {
        errorMsg.textContent = "Please enter a city name.";
        errorMsg.classList.remove("hidden");
        return;
    }

    try {
        loading.classList.remove("hidden");

        
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) throw new Error("Geocoding failed");

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const { latitude, longitude, name } = geoData.results[0];

        
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) throw new Error("Weather API error");

        const weatherData = await weatherResponse.json();
        const weather = weatherData.current_weather;

        
        document.getElementById("cityName").textContent = name;
        document.getElementById("temp").textContent = weather.temperature;
        document.getElementById("wind").textContent = weather.windspeed;

        
        document.getElementById("icon").src = getWeatherIcon(weather.weathercode);
        document.getElementById("icon").alt = "Weather icon";

        result.classList.remove("hidden");

    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
    }
}
