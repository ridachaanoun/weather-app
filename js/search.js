const apiKey = "1e3e8f230b6064d27976e41163a82b77";
const searchInput = document.querySelector(".searchinput");

const weatherIcons = {
  rain: "img/rain.png",
  clear: "img/sun.png",
  snow: "img/snow.png",
  clouds: "img/cloud.png",
  smoke: "img/cloud.png",
  mist: "img/mist.png",
  fog: "img/mist.png",
  haze: "img/haze.png",
};

// Function to fetch and display weather data
async function search(city, state = "", country = "") {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city},${state},${country}&appid=${apiKey}`
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log(data);


    // Update the UI with weather data
    document.querySelector(".return").style.display = "block";
    document.querySelector(".message").style.display = "none";
    document.querySelector(".error-message").style.display = "none";

    document.querySelector(".city-name").innerHTML = data.name;
    document.querySelector(".weather-temp").innerHTML = `${Math.floor(data.main.temp)}°`;
    document.querySelector(".wind").innerHTML = `${Math.floor(data.wind.speed)} m/s`;
    document.querySelector(".pressure").innerHTML = `${Math.floor(data.main.pressure)} hPa`;
    document.querySelector(".humidity").innerHTML = `${Math.floor(data.main.humidity)}%`;
    document.querySelector(".sunrise").innerHTML = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    document.querySelector(".sunset").innerHTML = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Set the weather icon
    const weatherImg = document.querySelector(".weather-img");
    const weatherCondition = data.weather[0].main.toLowerCase();

    weatherImg.src = weatherIcons[weatherCondition] || "img/sun.png";
  } catch (error) {
    // Handle errors and show the error message
    document.querySelector(".return").style.display = "none";
    document.querySelector(".message").style.display = "none";
    document.querySelector(".error-message").style.display = "block";
    console.error("Error fetching weather data:", error.message);
  }
}

// Trigger search on Enter key press
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    search(searchInput.value);
    console.log("Search triggered");
  }
});
