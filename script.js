let questions = [];

fetch('/get-questions')
    .then(res => res.json())
    .then(data => {
        questions = data;
        displayQuestions();
    });

function displayQuestions() {
    const quizDiv = document.getElementById("quiz");

    questions.forEach((q, index) => {
        const div = document.createElement("div");
        div.classList.add("question");

        div.innerHTML = `
            <h3>${index + 1}. ${q.question}</h3>
            ${q.options.map(opt => `
                <label>
                    <input type="radio" name="q${index}" value="${opt}">
                    ${opt}
                </label><br>
            `).join("")}
        `;

        quizDiv.appendChild(div);
    });
}

function submitQuiz() {
    const answers = questions.map((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        return selected ? selected.value : "";
    });

    fetch('/submit', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ answers })
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById("result").innerText =
                `Your Score: ${data.score} / ${data.total}`;
        });
}
