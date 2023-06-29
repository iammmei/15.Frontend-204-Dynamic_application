const inputvalue = document.getElementById("cityinput");
const button = document.getElementById("btn");
const cityOutput = document.querySelector(".cityOutput");
const img = document.querySelector("img");
const temperature = document.querySelector(".temperature");
const sky = document.querySelector(".sky");
const tableRows = document.querySelectorAll("tbody tr");

const apiKey = "9099dad86f1f69e0190cade738d1385a";
const unsplashApiKey = "gJflep4IMFN_9segkWrtGb0jHctbGXBMsEeGCxHgfm4";
const unsplashBaseUrl = "https://api.unsplash.com/photos/random?query=";

// Function to convert temperature from Kelvin to Celsius
function convertion(val) {
  return (val - 273).toFixed(2);
}

// Function to get the day of the week from a date object
function getDayOfWeek(date) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()];
}

// Function to update the table rows with forecast data
function updateForecastTable(forecastData) {
  for (let i = 0; i < forecastData.length; i++) {
    const forecastDay = getDayOfWeek(
      new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * (i + 1))
    ); // Get the forecast day
    const minTemperature = Math.min(...forecastData[i]);
    const maxTemperature = Math.max(...forecastData[i]);
    tableRows[
      i
    ].innerHTML = `<td>${forecastDay}</td><td> min: ${minTemperature}°C<br> max: ${maxTemperature}°C</td>`;
  }
}

function handleButtonClick(e) {
  e.preventDefault();
  const city = inputvalue.value;
  showWeatherData(city);
}

function handleEnterKey(e) {
  if (e.code === "Enter") {
    const city = e.target.value;
    showWeatherData(city);
  }
}

button.addEventListener("click", handleButtonClick);
inputvalue.addEventListener("keyup", handleEnterKey);

function showWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const nameval = data.city.name;
      const weather = data.list[0].weather[0].description;
      const forecastData = [];

      // Update current weather information
      cityOutput.textContent = nameval;
      temperature.textContent = ""; // Clear previous temperature content
      sky.textContent = weather;

      // Fetch image from Unsplash API
      fetch(`${unsplashBaseUrl}${city}`, {
        headers: {
          Authorization: `Client-ID ${unsplashApiKey}`,
        },
      })
        .then((res) => res.json())
        .then((imageData) => {
          const imageUrl = imageData.urls.regular;
          img.src = imageUrl;
        })
        .catch((error) => {
          console.log("Error fetching image data: ", error);
        });

      // Extract forecast data for the next five days
      for (let i = 0; i < 5; i++) {
        const forecastTemperatures = data.list
          .slice(i * 8, (i + 1) * 8)
          .map((item) => convertion(item.main.temp));
        forecastData.push(forecastTemperatures);
      }

      // Update the forecast table
      updateForecastTable(forecastData);

      // Calculate overall minimum and maximum temperatures
      const overallMinTemperature = Math.min(...forecastData.flat());
      const overallMaxTemperature = Math.max(...forecastData.flat());

      // Update main weather information with overall temperature range
      temperature.textContent = `min: ${overallMinTemperature}°C 	  
       ~ ◕‿◕ ~
           max: ${overallMaxTemperature}°C`;

      // Get the current date and update the dayname tag
      const currentDate = new Date();
      const dayName = getDayOfWeek(currentDate);
      document.querySelector(".dayname").textContent = dayName;
    })
    .catch((error) => {
      console.log("Error fetching weather data: ", error);
    });
}
