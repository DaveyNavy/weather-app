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

function displayData(data) {
  const container = document.querySelector("#content");

  const title = document.createElement("h1");
  title.textContent = "Weather for " + data.resolvedAddress;

  const temperature = document.createElement();
  container.appendChild(title);
}

// const form = document.querySelector("form");
// const input = document.querySelector("input");
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const location = input.value;
//   const p = retrieveData(location);
//   console.log(p);
//   p.then((response) => console.log(response)).catch((error) =>
//     console.log(error)
//   );
//   form.reset();
// });
