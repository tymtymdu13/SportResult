// API URLs

const SCOREBAT_LIVE = "https://www.scorebat.com/video-api/v3/live/";
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";


// FETCH GENERIQUE

async function getData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return null;
    }
}

// MATCHS EN DIRECT

async function getLiveBasket() {
    const data = await getData(SCOREBAT_LIVE);
    if (!data?.response) return [];

    // Scorebat ne filtre pas par sport → on filtre manuellement
    return data.response
        .filter(m => m.competition.toLowerCase().includes("basket"))
        .map(match => ({
            home: match.title.split(" vs ")[0],
            away: match.title.split(" vs ")[1],
            date: match.date,
            time: "",
            score: "En direct",
            strHomeTeamBadge: "",
            strAwayTeamBadge: ""
        }));
}

// MATCHS PASSES SUR 5 JOURS

async function getLastBasket10Days() {
    let results = [];

    for (let i = 1; i <= 10; i++) {
        const date = new Date(Date.now() - i * 86400000)
            .toISOString().split("T")[0];

        const data = await getData(`${BASE_URL}/eventsday.php?d=${date}&s=Basketball`);
        if (data?.events?.length > 0) results.push(...data.events);

        if (results.length >= 10) break;
    }

    return results.slice(0, 10);
}

// MATCHS FUTURS SUR 5 JOURS

async function getNextBasket10Days() {
    let results = [];

    for (let i = 1; i <= 10; i++) {
        const date = new Date(Date.now() + i * 86400000)
            .toISOString().split("T")[0];

        const data = await getData(`${BASE_URL}/eventsday.php?d=${date}&s=Basketball`);
        if (data?.events?.length > 0) results.push(...data.events);

        if (results.length >= 10) break;
    }

    return results.slice(0, 10);
}

// AFFICHAGE D’UN BLOC (AVEC LOGOS)

function displayBasket(containerId, matches, titre) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<h3>${titre}</h3>`;

    if (!matches || matches.length === 0) {
        container.innerHTML += "<p>Aucun match trouvé.</p>";
        return;
    }

    matches.forEach(match => {
        const home = match.home || match.strHomeTeam;
        const away = match.away || match.strAwayTeam;

        const homeLogo = match.strHomeTeamBadge || "";
        const awayLogo = match.strAwayTeamBadge || "";

        const date = match.date || match.dateEvent;
        const time = match.time || match.strTime;
        const score = match.score || (match.intHomeScore !== null ? `${match.intHomeScore} - ${match.intAwayScore}` : "Match à venir");

        const div = document.createElement("div");
        div.classList.add("match-card");

        div.innerHTML = `
            <div class="team">
                <img src="${homeLogo}" class="team-logo">
                <span>${home}</span>
            </div>

            <div class="vs">vs</div>

            <div class="team">
                <img src="${awayLogo}" class="team-logo">
                <span>${away}</span>
            </div>

            <div class="info">
                <p>${date} ${time ? "- " + time : ""}</p>
                <p>${score}</p>
            </div>
        `;

        container.appendChild(div);
    });
}

// AFFICHAGE GLOBAL

function displayAllBasket(matches) {
    const container = document.getElementById("allBasket");
    container.innerHTML = "<h3>Tous les matchs</h3>";

    if (!matches || matches.length === 0) {
        container.innerHTML += "<p>Aucun match trouvé.</p>";
        return;
    }

    matches.forEach(match => {
        const home = match.home || match.strHomeTeam;
        const away = match.away || match.strAwayTeam;
        const date = match.date || match.dateEvent;
        const time = match.time || match.strTime;

        const div = document.createElement("p");
        div.textContent = `${home} vs ${away} - ${time || date}`;
        container.appendChild(div);
    });
}

// CHARGEMENT GLOBAL

async function chargerBasket() {
    const live = await getLiveBasket();
    const past = await getLastBasket10Days();
    const upcoming = await getNextBasket10Days();

    displayBasket("liveBasket", live, "Matchs en direct");
    displayBasket("pastBasket", past, "Résultats des 10 derniers jours");
    displayBasket("upcomingBasket", upcoming, "Matchs à venir (10 jours)");

    const all = [...live, ...upcoming, ...past];
    displayAllBasket(all);
}

chargerBasket();
