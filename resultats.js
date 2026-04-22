const container = document.querySelector(".container-res");
const scoreDiv = document.getElementById("score");
const recommencer = document.getElementById("recommencer");
const accueilBtn = document.getElementById("accueilBtn");
const versionText = document.getElementById("version");

const data = JSON.parse(sessionStorage.getItem("sessionActuelle"));
const reseau = window.sessionStorage.getItem("reseau");

let donnees;

if (reseau === "metro") {
    donnees = db.metro;
} else if (reseau === "train") {
    donnees = db.train;
} else if (reseau === "tram") {
    donnees = db.tram;
} else {
    alert("Réseau invalide");
    window.location.href = "index.html";
};

const renderPage = () => {
    versionText.textContent = "Version " + version;
    if (!data) {
        container.textContent = "Aucun résultat disponible.";
        return;
    }

    const titre = document.createElement("h2");
    titre.id = "resultScore";
    titre.textContent = `Score : ${Math.round(data.scoreTotal * 10) / 10} / ${data.totalQuestions}`;
    scoreDiv.appendChild(titre);

    data.details.forEach((question, index) => {
        const bloc = document.createElement("div");
        bloc.className = "result-block";

        const titreQuestion = document.createElement("h3");
        titreQuestion.textContent = `Question ${index + 1} — ${question.station}`;
        bloc.appendChild(titreQuestion);

        // Bonnes réponses
        const bonnesDiv = document.createElement("div");
        bonnesDiv.className = "bonnes";

        const bonnesTitre = document.createElement("p");
        bonnesTitre.textContent = "Réponses attendues :";
        bonnesDiv.appendChild(bonnesTitre);

        question.bonnesReponses.forEach(id => {
            const img = document.createElement("img");
            img.src = donnees.lignes.find(l => l.id === id).img;
            img.alt = id;
            img.className = "ligne";
            bonnesDiv.appendChild(img);
        });

        bloc.appendChild(bonnesDiv);

        // Réponses utilisateur
        const userDiv = document.createElement("div");
        userDiv.className = "utilisateur";

        const userTitre = document.createElement("p");
        userTitre.textContent = "Vos réponses :";
        userDiv.appendChild(userTitre);

        question.reponsesUtilisateur.forEach(id => {
            const img = document.createElement("img");
            img.src = donnees.lignes.find(l => l.id === id).img;
            img.alt = id;
            img.className = "ligne";
            userDiv.appendChild(img);
        });

        bloc.appendChild(userDiv);

        // Score question
        const score = document.createElement("p");
        score.textContent = `Score : ${Math.round(question.score * 10) / 10}`;
        bloc.appendChild(score);

        container.appendChild(bloc);
    });
};

renderPage()

recommencer.addEventListener("click", () => {
    window.sessionStorage.removeItem("sessionActuelle");
    window.history.back();
});

accueilBtn.addEventListener("click", () => {
    sessionStorage.removeItem("sessionActuelle");
    window.location.href = "index.html";
});