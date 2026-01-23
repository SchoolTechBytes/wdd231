const weatherSettings = {
    apiKey: "6d39b18bca595249e8cbf5593f8dde06",
    lat: 32.767,
    lon: -96.599,
    units: "imperial"
};

const weatherTemp = document.querySelector("#weather-temp");
const weatherDesc = document.querySelector("#weather-desc");
const forecastGrid = document.querySelector("#forecast");
const weatherNote = document.querySelector("#weather-note");

const toTitleCase = (text) =>
    text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

const updateCurrentWeather = async () => {
    const { apiKey, lat, lon, units } = weatherSettings;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Weather data unavailable.");
    }
    const data = await response.json();
    weatherTemp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = toTitleCase(data.weather[0].description);
};

const updateForecast = async () => {
    const { apiKey, lat, lon, units } = weatherSettings;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Forecast data unavailable.");
    }
    const data = await response.json();

    const daily = {};
    data.list.forEach((entry) => {
        const date = new Date(entry.dt * 1000);
        const key = date.toDateString();
        if (!daily[key] && date.getHours() >= 11 && date.getHours() <= 14) {
            daily[key] = {
                label: date.toLocaleDateString("en-US", { weekday: "short" }),
                temp: Math.round(entry.main.temp)
            };
        }
    });

    const days = Object.values(daily).slice(0, 3);
    forecastGrid.innerHTML = "";
    days.forEach((day) => {
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `<span>${day.label}</span><strong>${day.temp}°</strong>`;
        forecastGrid.appendChild(card);
    });
};

const loadWeather = async () => {
    try {
        const { apiKey } = weatherSettings;
        if (!apiKey || apiKey === "YOUR_OPENWEATHERMAP_KEY") {
            weatherDesc.textContent =
                "Add your OpenWeatherMap API key to load data.";
            return;
        }
        await updateCurrentWeather();
        await updateForecast();
        if (weatherNote) {
            weatherNote.textContent = "Forecast powered by OpenWeatherMap.";
        }
    } catch (error) {
        weatherDesc.textContent = "Weather data is currently unavailable.";
    }
};

const spotlightContainer = document.querySelector("#spotlights");
const membershipLabels = {
    1: "Member",
    2: "Silver",
    3: "Gold"
};

const shuffle = (items) => {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const renderSpotlights = (members) => {
    if (!spotlightContainer) {
        return;
    }

    spotlightContainer.innerHTML = "";
    members.forEach((member) => {
        const card = document.createElement("article");
        card.className = "spotlight-card";

        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
            <div class="spotlight-body">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p class="tag">${membershipLabels[member.membershipLevel] || "Member"}</p>
                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
            </div>
        `;

        spotlightContainer.appendChild(card);
    });
};

const loadSpotlights = async () => {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) {
            throw new Error("Member data unavailable.");
        }
        const data = await response.json();
        const eligible = data.filter((member) => member.membershipLevel >= 2);
        const count = eligible.length >= 3 ? 3 : 2;
        const selected = shuffle(eligible).slice(0, count);
        renderSpotlights(selected);
    } catch (error) {
        if (spotlightContainer) {
            spotlightContainer.textContent =
                "Member spotlights are currently unavailable.";
        }
    }
};

if (weatherTemp && weatherDesc && forecastGrid) {
    loadWeather();
}

if (spotlightContainer) {
    loadSpotlights();
}
