let quizData = [];
let userAnswers = [];
let timeLeft = 60;
let timer;

// Load quiz from backend
async function loadQuiz() {
    const res = await fetch("http://localhost:5000/api/quiz");
    quizData = await res.json();

    const quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = "";

    quizData.forEach((q, index) => {
        let html = `<div class="question">
        <h3>Q${index + 1}: ${q.question}</h3>`;

        q.options.forEach(option => {
            html += `
            <label>
                <input type="radio" name="q${index}" value="${option}" 
                onchange="saveAnswer(${index}, '${option}')">
                ${option}
            </label><br>`;
        });

        html += `</div>`;
        quizDiv.innerHTML += html;
    });

    startTimer();
}

// Save selected answer
function saveAnswer(index, answer) {
    userAnswers[index] = answer;
}

// Timer logic
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText =
            "Time Left: " + timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

// Submit answers
async function submitQuiz() {
    if (userAnswers.length !== quizData.length) {
        alert("Please answer all questions!");
        return;
    }

    clearInterval(timer);

    const res = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ answers: userAnswers })
    });

    const data = await res.json();

    document.getElementById("result").innerText =
        `Score: ${data.score}/${data.total}`;
}

// Restart quiz
function restartQuiz() {
    userAnswers = [];
    timeLeft = 60;
    document.getElementById("result").innerText = "";
    loadQuiz();
}

loadQuiz();