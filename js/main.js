const apiKey = "1e3e8f230b6064d27976e41163a82b77";

const forecastBox = document.getElementById("forecast-box");

const conditionMap = {
    rain: "img/rain.png",
    clear: "img/sun.png",
    "clear sky": "img/sun.png",
    snow: "img/snow.png",
    clouds: "img/cloud.png",
    smoke: "img/cloud.png",
    mist: "img/mist.png",
    fog: "img/mist.png",
    haze: "img/haze.png",
  };

navigator.geolocation.getCurrentPosition(
  async (position) => {
    try {
      const { latitude: lat, longitude: lon } = position.coords;

      // Fetch city name using latitude and longitude
      const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`);
      const geoData = await geoResponse.json();
      console.log(geoData);
      const city = geoData[0].name;

      // Fetch weather details for the city
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
      const weatherData = await weatherResponse.json();
      console.log(weatherData);

      // Update current weather information
      const weather = weatherData.list[0];
      console.log(weather);
      document.getElementById("city-name").innerText = weatherData.city.name;
      document.getElementById("metric").innerText = `${Math.floor(weather.main.temp)}°`;
      document.querySelectorAll("#weather-main")[0].innerText = weather.weather[0].description;
      document.querySelectorAll("#weather-main")[1].innerText = weather.weather[0].description;
      document.getElementById("humidity").innerText = `${Math.floor(weather.main.humidity)}`;
      document.getElementById("feels-like").innerText = `${Math.floor(weather.main.feels_like)}`;
      document.getElementById("temp-min-today").innerText = `${Math.floor(weather.main.temp_min)}°`;
      document.getElementById("temp-max-today").innerText = `${Math.floor(weather.main.temp_max)}°`;

      // Set weather icons based on condition
      const condition = weather.weather[0].main.toLowerCase();
      const weatherImg = document.querySelector(".weather-icon");
      const weatherImgs = document.querySelector(".weather-icons");

      const iconSrc = conditionMap[condition] || "img/sun.png";
      weatherImg.src = iconSrc;
      weatherImgs.src = iconSrc;

      // Fetch and display 5-day forecast
      displayForecast(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  },
  () => {
    alert("Please turn on your location and refresh the page.");
  }
);


// Function to display the 5-day weather forecast
function displayForecast(data) {
  const dailyForecasts = {};


  data.list.forEach((item) => {
    //   console.log(item.dt_txt);
      const date = item.dt_txt.split(" ")[0];
    //   console.log(date);
    if (!dailyForecasts[date]) {
        // console.log(1);
      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const day = new Date(date).getDay();
    //   console.log(day);
      dailyForecasts[date] = {
        day_today: dayName[day],
        temperature: `${Math.floor(item.main.temp)}°`,
        description: item.weather[0].description,
        weatherImg: item.weather[0].main.toLowerCase(),
      };
    }
  });
console.log(dailyForecasts)

  for (const date in dailyForecasts) {
    
    const { day_today, temperature, description, weatherImg } = dailyForecasts[date];

    const imgSrc = conditionMap[weatherImg] || "img/sun.png";

    forecastBox.innerHTML += `
      <div class="weather-forecast-box">
        <div class="day-weather"><span>${day_today}</span></div>
        <div class="weather-icon-forecast"><img src="${imgSrc}" /></div>
        <div class="temp-weather"><span>${temperature}</span></div>
        <div class="weather-main-forecast">${description}</div>
      </div>`;
  }

}
