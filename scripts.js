const API_KEY = "TJDH5L43YTJM9TWB34Z9LJ24Y";

async function retrieveData(location) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`,
    { mode: "cors" }
  );
  if (!response.ok) throw new Error(response.status);
  const data = await response.json();
  return {
    address: data.resolvedAddress,
    description: data.description,
    alerts: data.alerts,
    currentConditions: data.currentConditions,
    forecast: data.days,
  };
}

function clear() {
  const container = document.querySelector("#content");
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

function FtoC(temp) {
  return Math.round((5 / 9) * (temp - 32) * 10) / 10;
}

function addData(name, data, container) {
  const h3 = document.createElement("p");
  h3.textContent = name + ": " + data;
  container.appendChild(h3);
}
function displayData(data) {
  console.log(data);
  clear();
  const container = document.querySelector("#content");

  const title = document.createElement("h1");
  title.textContent = "Weather for " + data.address;
  container.appendChild(title);

  const temperatureHeader = document.createElement("div");
  temperatureHeader.className = "temperature-header";
  const temperatureDiv = document.createElement("div");
  temperatureDiv.id = "temperature";
  const temperature = document.createElement("h1");
  temperature.textContent = data.currentConditions.temp;
  const unit = document.createElement("h1");
  unit.textContent = "°F";
  const img = document.createElement("img");
  img.className = "icon";
  if (data.currentConditions.icon.includes("rain")) {
    img.setAttribute("src", "./images/rain.svg");
  } else if (data.currentConditions.icon.includes("clear")) {
    img.setAttribute("src", "./images/sun.svg");
  } else {
    img.setAttribute("src", "./images/cloud.svg");
  }

  temperatureHeader.appendChild(temperatureDiv);
  temperatureDiv.appendChild(temperature);
  temperatureDiv.appendChild(unit);
  temperatureHeader.appendChild(img);
  container.appendChild(temperatureHeader);

  const description = document.createElement("p");
  description.textContent = data.description;
  description.className = "description";
  container.appendChild(description);

  const forecast = document.createElement("h2");
  forecast.textContent = "Weekly Forecast";
  forecast.setAttribute("style", "margin-top: 2rem");
  const forecastDiv = document.createElement("div");
  forecastDiv.className = "forecast";

  const weeklyHighs = [];
  const weeklyLows = [];

  for (let i = 0; i < 7; i++) {
    const currDay = data.forecast[i];
    const date = document.createElement("h3");
    date.textContent = currDay.datetime;

    const div = document.createElement("div");
    const high = document.createElement("p");
    high.textContent = "High: " + currDay.tempmax + " °F";
    const low = document.createElement("p");
    low.textContent = "Low: " + currDay.tempmin + " °F";
    const desc = document.createElement("p");
    desc.textContent = currDay.conditions;

    weeklyHighs.push(high);
    weeklyLows.push(low);

    div.appendChild(high);
    div.appendChild(low);
    div.appendChild(desc);

    forecastDiv.appendChild(date);
    forecastDiv.appendChild(div);
  }

  const F = "°F";
  const C = "°C";
  temperatureDiv.addEventListener("click", () => {
    unit.textContent = unit.textContent == F ? C : F;
    temperature.textContent =
      unit.textContent == F
        ? data.currentConditions.temp
        : FtoC(data.currentConditions.temp);
    weeklyHighs.forEach(
      (high, index) =>
        (high.textContent =
          "High: " +
          (unit.textContent == F
            ? data.forecast[index].tempmax
            : FtoC(data.forecast[index].tempmax)) +
          " " +
          unit.textContent)
    );
    weeklyLows.forEach(
      (low, index) =>
        (low.textContent =
          "Low: " +
          (unit.textContent == F
            ? data.forecast[index].tempmin
            : FtoC(data.forecast[index].tempmin)) +
          " " +
          unit.textContent)
    );
  });
  container.appendChild(forecast);
  container.appendChild(forecastDiv);

  const miscData = document.createElement("h2");
  miscData.textContent = "Other Data";
  miscData.setAttribute("style", "margin-top: 2rem");
  container.appendChild(miscData);

  const div = document.createElement("div");
  div.setAttribute("style", "padding: 0 2rem");
  addData("Humidity", data.currentConditions.humidity, div);
  addData("Dew", data.currentConditions.dew, div);
  addData("Cloud cover", data.currentConditions.cloudcover, div);
  addData("Chance of rain", data.currentConditions.precipprob, div);
  addData("UV index", data.currentConditions.uvindex, div);
  addData("Sunrise", data.currentConditions.sunrise, div);
  addData("Sunset", data.currentConditions.sunset, div);
  container.appendChild(div);
}

function displayError(errorCode) {
  clear();
  const container = document.querySelector("#content");
  const error = document.createElement("h1");
  if (errorCode == 400) {
    error.textContent = "Unable to find data for this location!";
  }
  container.appendChild(error);
}

const form = document.querySelector("form");
const input = document.querySelector("input");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const location = input.value;
  const p = retrieveData(location);
  p.then((response) => displayData(response)).catch((error) =>
    displayError(error.message)
  );
  form.reset();
});
