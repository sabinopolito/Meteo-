document.getElementById("getWeather").addEventListener("click", function () {
    const city = document.getElementById("city").value;
    const day = parseInt(document.getElementById("day").value);

    if (!city) {
        alert("Inserisci una città valida!");
        return;
    }

    // API Geocoding
    const GEO_API_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;

    fetch(GEO_API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Errore nella ricerca della città");
            return response.json();
        })
        .then(data => {
            if (!data.results || data.results.length === 0) throw new Error("Città non trovata");
            const { latitude, longitude } = data.results[0];
            ottieniMeteo(latitude, longitude, city, day);
        })
        .catch(err => {
            console.error(err.message);
            alert(err.message);
        });
});

function ottieniMeteo(latitude, longitude, city, day) {
    const WEATHER_API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`;

    fetch(WEATHER_API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Errore nella richiesta meteo");
            return response.json();
        })
        .then(data => {
            mostraMeteo(data, city, day);
        })
        .catch(err => {
            console.error(err.message);
            alert(err.message);
        });
}

function mostraMeteo(data, city, day) {
    const weatherResults = document.getElementById("weatherResults");
    const weatherData = document.getElementById("weatherData");

    weatherData.innerHTML = "";
    document.body.className = ""; // Reset sfondo

    const maxTemp = data.daily.temperature_2m_max[day];
    const minTemp = data.daily.temperature_2m_min[day];
    const precipitation = data.daily.precipitation_sum[day];
    const weathercode = data.daily.weathercode[day];

    const weatherDescriptions = {
        0: "Soleggiato",
        1: "Prevalentemente sereno",
        2: "Parzialmente nuvoloso",
        3: "Nuvoloso",
        61: "Pioggia leggera",
        63: "Pioggia moderata",
        65: "Pioggia intensa"
    };

    const condition = weatherDescriptions[weathercode] || "Condizione sconosciuta";

    // Cambia sfondo dinamico
    if (weathercode === 0 || weathercode === 1) {
        document.body.classList.add("sunny");
    } else if (weathercode >= 61 && weathercode <= 65) {
        document.body.classList.add("rainy");
        aggiungiPioggia();
    } else if (weathercode === 2 || weathercode === 3) {
        document.body.classList.add("cloudy");
        aggiungiNuvole();
    }

    // Mostra i risultati
    weatherData.innerHTML = `
        <p><strong>Città:</strong> ${city}</p>
        <p><strong>Temperatura Massima:</strong> ${maxTemp}°C</p>
        <p><strong>Temperatura Minima:</strong> ${minTemp}°C</p>
        <p><strong>Precipitazioni:</strong> ${precipitation} mm</p>
        <p><strong>Condizione:</strong> ${condition}</p>
    `;
    weatherResults.style.display = "block";
}

function aggiungiPioggia() {
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement("div");
        drop.className = "rain-drop";
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.animationDelay = `${Math.random()}s`;
        document.body.appendChild(drop);
    }
}

function aggiungiNuvole() {
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement("div");
        cloud.className = "cloud";
        cloud.style.top = `${Math.random() * 50 + 10}vh`;
        cloud.style.left = `${Math.random() * 100}vw`;
        document.body.appendChild(cloud);
    }
}
