// API URLs

const SCOREBAT_LIVE = "https://www.scorebat.com/video-api/v3/live/";
const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

// Rugby leagues (toutes compétitions)
const RUGBY_LEAGUES = [4474,4475,4476,4477,4478,4479,4480,4481];

// FETCH GENERIQUE

async function getData(url) {
    try {
        const r = await fetch(url);
        return await r.json();
    } catch {
        return null;
    }
}

// LIVE

async function getLiveMatchesFiltered(keyword) {
    const data = await getData(SCOREBAT_LIVE);
    if (!data?.response) return [];

    return data.response
        .filter(m => m.competition.toLowerCase().includes(keyword))
        .map(m => ({
            home: m.title.split(" vs ")[0],
            away: m.title.split(" vs ")[1],
            date: m.date,
            score: "En direct"
        }));
}

// FOOTBALL

async function getFootballPast() {
    let results = [];
    for (let i = 1; i <= 5; i++) {
        const d = new Date(Date.now() - i*86400000).toISOString().split("T")[0];
        const data = await getData(`${BASE_URL}/eventsday.php?d=${d}&s=Soccer`);
        if (data?.events) results.push(...data.events);
    }
    return results.slice(0,20);
}

async function getFootballNext() {
    let results = [];
    for (let i = 1; i <= 5; i++) {
        const d = new Date(Date.now() + i*86400000).toISOString().split("T")[0];
        const data = await getData(`${BASE_URL}/eventsday.php?d=${d}&s=Soccer`);
        if (data?.events) results.push(...data.events);
    }
    return results.slice(0,20);
}

// BASKETBALL

async function getBasketPast() {
    let results = [];
    for (let i = 1; i <= 5; i++) {
        const d = new Date(Date.now() - i*86400000).toISOString().split("T")[0];
        const data = await getData(`${BASE_URL}/eventsday.php?d=${d}&s=Basketball`);
        if (data?.events) results.push(...data.events);
    }
    return results.slice(0,20);
}

async function getBasketNext() {
    let results = [];
    for (let i = 1; i <= 5; i++) {
        const d = new Date(Date.now() + i*86400000).toISOString().split("T")[0];
        const data = await getData(`${BASE_URL}/eventsday.php?d=${d}&s=Basketball`);
        if (data?.events) results.push(...data.events);
    }
    return results.slice(0,20);
}

// RUGBY

async function getRugbyPast() {
    let results = [];
    for (let league of RUGBY_LEAGUES) {
        const data = await getData(`${BASE_URL}/eventspastleague.php?id=${league}`);
        if (data?.events) results.push(...data.events);
    }
    results.sort((a,b)=>new Date(b.dateEvent)-new Date(a.dateEvent));
    return results.slice(0,20);
}

async function getRugbyNext() {
    let results = [];
    for (let league of RUGBY_LEAGUES) {
        const data = await getData(`${BASE_URL}/eventsnextleague.php?id=${league}`);
        if (data?.events) results.push(...data.events);
    }
    results.sort((a,b)=>new Date(a.dateEvent)-new Date(b.dateEvent));
    return results.slice(0,20);
}

// AFFICHAGE

function display(containerId, matches, titre) {
    const c = document.getElementById(containerId);
    c.innerHTML = `<h3>${titre}</h3>`;

    if (!matches || matches.length === 0) {
    c.innerHTML += '<p class="no-match">Aucun match trouvé.</p>';
    return;
}


    matches.forEach(m => {
        const div = document.createElement("div");
        div.classList.add("match-card");

        div.innerHTML = `
            <strong>${m.home || m.strHomeTeam} vs ${m.away || m.strAwayTeam}</strong><br>
            ${m.date || m.dateEvent} ${m.strTime ? "- "+m.strTime : ""}<br>
            ${m.score || (m.intHomeScore !== null ? m.intHomeScore+" - "+m.intAwayScore : "Match à venir")}
        `;

        c.appendChild(div);
    });
}

// CHARGEMENT GLOBAL

async function chargerAccueil() {

    // LIVE
    display("liveFootball", await getLiveMatchesFiltered("soccer"), "Football - En direct");
    display("liveBasket", await getLiveMatchesFiltered("basket"), "Basketball - En direct");
    display("liveRugby", await getLiveMatchesFiltered("rugby"), "Rugby - En direct");

    // FOOTBALL
    display("pastFootball", await getFootballPast(), "Football - Résultats");
    display("upcomingFootball", await getFootballNext(), "Football - À venir");

    // BASKET
    display("pastBasket", await getBasketPast(), "Basketball - Résultats");
    display("upcomingBasket", await getBasketNext(), "Basketball - À venir");

    // RUGBY
    display("pastRugby", await getRugbyPast(), "Rugby - Résultats");
    display("upcomingRugby", await getRugbyNext(), "Rugby - À venir");
}

chargerAccueil();
