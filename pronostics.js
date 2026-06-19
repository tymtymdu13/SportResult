// LISTES DE PRONOSTICS

const basePronostics = [
    "Victoire de l'équipe 1",
    "Victoire de l'équipe 2",
    "Match nul",
    "Plus de 2.5 buts/points",
    "Moins de 2.5 buts/points",
    "Les deux équipes marquent",
    "Victoire large",
    "Match serré",
    "Score exact difficile à prévoir"
];

const pronosticsFootball = [
    "Victoire domicile",
    "Match nul",
    "Victoire extérieur",
    "Plus de 2.5 buts",
    "Moins de 2.5 buts",
    "Les deux équipes marquent",
    "Score exact 2-1",
    "Score exact 1-1"
];

const pronosticsBasket = [
    "Victoire domicile",
    "Victoire extérieur",
    "Plus de 180 points",
    "Moins de 160 points",
    "Match serré",
    "Victoire de plus de 10 points"
];

const pronosticsRugby = [
    "Victoire domicile",
    "Victoire extérieur",
    "Plus de 40 points",
    "Moins de 30 points",
    "Match serré",
    "Victoire avec bonus offensif"
];

// FONCTION UTILITAIRE

function randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function animateResult(id, text) {
    const el = document.getElementById(id);
    el.style.opacity = 0;
    setTimeout(() => {
        el.textContent = text;
        el.style.opacity = 1;
    }, 200);
}

// PRONOSTIC ALÉATOIRE

document.getElementById("btnRandom").addEventListener("click", () => {
    animateResult("randomResult", randomItem(basePronostics));
});

// PRONOSTIC PAR SPORT

document.getElementById("btnSport").addEventListener("click", () => {
    const sport = document.getElementById("sportSelect").value;

    let list = [];

    if (sport === "football") list = pronosticsFootball;
    if (sport === "basketball") list = pronosticsBasket;
    if (sport === "rugby") list = pronosticsRugby;

    animateResult("sportResult", randomItem(list));
});

// PRONOSTIC PERSONNALISÉ

document.getElementById("btnCustom").addEventListener("click", () => {
    const t1 = document.getElementById("team1").value.trim();
    const t2 = document.getElementById("team2").value.trim();

    if (t1 === "" || t2 === "") {
        animateResult("customResult", "Merci de remplir les deux équipes.");
        return;
    }

    const p = randomItem(basePronostics);

    animateResult("customResult", `Pronostic pour ${t1} vs ${t2} : ${p}`);
});
