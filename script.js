const inputvalue = document.getElementById("cityinput");
const button = document.getElementById("btn");
const city = document.querySelector(".cityOutput");
const img = document.querySelector("img");
const temperature = document.querySelector(".temperature");
const sky = document.querySelector(".sky");
const tableRows = document.querySelectorAll("tbody tr");

const apiKey = "9099dad86f1f69e0190cade738d1385a";
const imgkey = "gJflep4IMFN_9segkWrtGb0jHctbGXBMsEeGCxHgfm4";
// Function to convert temperature from Kelvin to Celsius
function convertion(val) {
  return (val - 273).toFixed(2);
}

// Function to update the table rows with forecast data
function updateForecastTable(forecastData) {
  for (let i = 0; i < forecastData.length; i++) {
    tableRows[i].innerHTML = `<td>${forecastData[i]} C</td>`;
  }
}

button.addEventListener("click", () => {
  const cityName = inputvalue.value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const nameval = data.city.name;
      const weather = data.list[0].weather[0].description;
      const temperatureVal = data.list[0].main.temp;
      const forecastData = [];

      // Update current weather information
      city.textContent = nameval;
      temperature.textContent = `${convertion(temperatureVal)} C`;
      sky.textContent = weather;

      // Extract forecast data for the next five days
      for (let i = 0; i < 5; i++) {
        const forecastTemperature = data.list[i * 8].main.temp;
        forecastData.push(convertion(forecastTemperature));
      }

      // Update the forecast table
      updateForecastTable(forecastData);
    })
    .catch((error) => {
      console.log("Error fetching weather data: ", error);
    });
});
