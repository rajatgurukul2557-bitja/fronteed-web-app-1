let quizData = [];
let userAnswers = [];

async function loadQuiz() {
    const res = await fetch("http://localhost:5000/api/quiz");
    quizData = await res.json();

    const quizDiv = document.getElementById("quiz");

    quizData.forEach((q, index) => {
        let html = `<h3>${q.question}</h3>`;

        q.options.forEach(option => {
            html += `
            <input type="radio" name="q${index}" value="${option}" 
            onchange="saveAnswer(${index}, '${option}')">
            ${option}<br>`;
        });

        quizDiv.innerHTML += html;
    });
}

function saveAnswer(index, answer) {
    userAnswers[index] = answer;
}

async function submitQuiz() {
    const res = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ answers: userAnswers })
    });

    const data = await res.json();

    document.getElementById("result").innerText =
        "Your Score: " + data.score;
}

loadQuiz();