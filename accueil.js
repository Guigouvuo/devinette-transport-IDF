const startQuizButton = document.getElementById("startQuizButton");
const reseauSelect = document.getElementById("reseau");
const nbQuestions = document.getElementById("nbQuestions");

const startQuiz = () => {
    if (reseauSelect.value === "null" || !nbQuestions.value) {
        window.alert("Veuillez sélectionner un réseau et saisir un nombre de questions !")
        return;
    }

    window.sessionStorage.setItem("reseau", reseauSelect.value);
    window.sessionStorage.setItem("questions", nbQuestions.value);
    // Rediriger vers la page du quiz
    window.location.href = `quiz.html?reseau=${reseauSelect.value}&questions=${nbQuestions.value}`;
};

startQuizButton.addEventListener("click", startQuiz);
nbQuestions.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        startQuiz();
    }
});