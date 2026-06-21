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

async function getLiveMatches() {
    const data = await getData(SCOREBAT_LIVE);
    if (!data?.response) return [];

    return data.response.map(match => ({
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

async function getLastMatches10Days() {
    let results = [];

    for (let i = 1; i <= 5; i++) {
        const date = new Date(Date.now() - i * 86400000)
            .toISOString().split("T")[0];

        const data = await getData(`${BASE_URL}/eventsday.php?d=${date}&s=Soccer`);
        if (data?.events?.length > 0) results.push(...data.events);

        if (results.length >= 10) break;
    }

    return results.slice(0, 10);
}

// MATCHS FUTURS SUR 5 JOURS

async function getNextMatches10Days() {
    let results = [];

    for (let i = 1; i <= 5; i++) {
        const date = new Date(Date.now() + i * 86400000)
            .toISOString().split("T")[0];

        const data = await getData(`${BASE_URL}/eventsday.php?d=${date}&s=Soccer`);
        if (data?.events?.length > 0) results.push(...data.events);

        if (results.length >= 10) break;
    }

    return results.slice(0, 10);
}

// AFFICHAGE D’UN BLOC (AVEC LOGOS)

function displayMatches(containerId, matches, titre) {
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

function displayAllFootball(matches) {
    const container = document.getElementById("allFootball");
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

async function chargerFootball() {
    const live = await getLiveMatches();
    const past = await getLastMatches10Days();
    const upcoming = await getNextMatches10Days();

    displayMatches("liveFootball", live, "Matchs en direct");
    displayMatches("pastFootball", past, "Résultats des 10 derniers jours");
    displayMatches("upcomingFootball", upcoming, "Matchs à venir (10 jours)");

    const all = [...live, ...upcoming, ...past];
    displayAllFootball(all);
}

chargerFootball();
