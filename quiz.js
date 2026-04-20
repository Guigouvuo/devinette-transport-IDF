const urlParams = new URLSearchParams(window.location.search);
const reseau = urlParams.get("reseau");
const questions = parseInt(urlParams.get("questions"), 10);

const versionText = document.getElementById("version");
const arret = document.getElementById("arret");
const buttons = document.getElementById("buttons");
const valider = document.getElementById("valider");
const avancement = document.getElementById("avancement");

let donnees;

if (reseau === "metro") {
    donnees = db.metro;
} else if (reseau === "train") {
    donnees = db.train;
} else if (reseau === "bus") {
    donnees = db.bus;
} else if (reseau === "tram") {
    donnees = db.tram;
} else {
    alert("Réseau invalide");
    window.location.href = "index.html";
};

const shuffleArray = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const stationsAleatoires = shuffleArray(donnees.stations).slice(0, questions);
let currentQuestionIndex = 0;
let score = 0;
let sessionActuelle = [];

const renderPage = () => {
    displayButtons();
    displayCurrentStation();
    versionText.textContent = "Version " + version;
};

const displayButtons = () => {
    donnees.lignes.forEach((ligne) => {
        const lineButton = document.createElement("div");
        lineButton.classList.add("line-button");
        const input = document.createElement("input");
        input.type = "checkbox";
        const label = document.createElement("label");
        const img = document.createElement("img");
        img.src = ligne.img;
        img.onclick = () => input.checked = !input.checked;
        label.appendChild(img);
        
        lineButton.appendChild(input);
        lineButton.appendChild(label);
        buttons.appendChild(lineButton);
    });
};

const displayCurrentStation = () => {
    if (currentQuestionIndex >= stationsAleatoires.length) {
        const finalScore = Math.round(score * 10) / 10;
        arret.textContent = `Quiz terminé. Score : ${finalScore}/${stationsAleatoires.length}`;
        window.location.href = "resultats.html";
        return;
    }

    const station = stationsAleatoires[currentQuestionIndex];
    arret.textContent = station.nom;
    avancement.textContent = `Question ${currentQuestionIndex + 1} sur ${stationsAleatoires.length}`;
};

const nextQuestion = () => {
    const station = stationsAleatoires[currentQuestionIndex];
    const checkboxes = buttons.querySelectorAll("input");

    let questionScore = 0;
    let maxScore = station.lignes.length;

    checkboxes.forEach((checkbox, index) => {
        const ligne = donnees.lignes[index];
        const shouldBeChecked = station.lignes.includes(ligne.id);

        if (checkbox.checked && shouldBeChecked) {
            questionScore++;
        } else if (checkbox.checked && !shouldBeChecked) {
            questionScore--;
        }
    });

    // Empêcher un score négatif
    if (questionScore < 0) questionScore = 0;

    // Normalisation sur 1
    const normalizedScore = maxScore > 0 ? questionScore / maxScore : 0;

    score += normalizedScore;

    // Sauvegarde de la question et des réponses
    const reponsesUtilisateur = [];
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            reponsesUtilisateur.push(donnees.lignes[index].id);
        }
    });

    sessionActuelle.push({
        station: station.nom,
        bonnesReponses: station.lignes,
        reponsesUtilisateur: reponsesUtilisateur,
        score: normalizedScore
    });

    // reset checkboxes
    checkboxes.forEach(cb => cb.checked = false);

    currentQuestionIndex++;

    // Si quiz terminé, sauvegarde dans sessionStorage
    if (currentQuestionIndex >= stationsAleatoires.length) {
        window.sessionStorage.setItem("sessionActuelle", JSON.stringify({
            scoreTotal: score,
            totalQuestions: stationsAleatoires.length,
            details: sessionActuelle
        }));
    }

    displayCurrentStation();
};

valider.addEventListener("click", nextQuestion);

renderPage();