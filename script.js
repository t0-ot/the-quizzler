let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

const submitButton = document.getElementById("submit-btn");

// Fade out intro, show quiz, then load questions
document.getElementById("start-btn").addEventListener("click", function () {
    const intro = document.getElementById("intro-screen");
    intro.classList.add("fade-out");
    setTimeout(() => {
        intro.style.display = "none";
        const quiz = document.querySelector(".quiz-container");
        quiz.classList.remove("hidden");
        loadQuestions(); // Only load after intro fades out
    }, 1000); // Match this with your fade duration
});

// Load questions from JSON
function loadQuestions() {
    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            questions = data;
            loadQuestion(currentQuestionIndex);
        })
        .catch(error => console.error("Error loading questions:", error));
}

// Load current question
function loadQuestion(index) {
    const questionData = questions[index];
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");

    questionElement.innerHTML = `
        <h2>${questionData.question}</h2>
        <div class="answers">
            ${questionData.options.map(option => 
                `<button class="answer-btn" onclick="selectAnswer('${option}')">${option}</button>`
            ).join('')}
        </div>
    `;
    
    const quizContent = document.getElementById("quiz-content");
    quizContent.innerHTML = ''; // Clear previous question
    quizContent.appendChild(questionElement);
    
    // Disable the submit button until an answer is selected
    submitButton.disabled = true;
    submitButton.classList.add("disabled");
}

// Handle answer selection/deselection
function selectAnswer(selected) {
    if (selectedAnswer === selected) {
        selectedAnswer = null;
        resetAnswerButtons();
        submitButton.disabled = true;
        submitButton.classList.add("disabled");
    } else {
        selectedAnswer = selected;
        submitButton.disabled = false;
        submitButton.classList.remove("disabled");
        resetAnswerButtons();
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            if (button.textContent === selected) {
                button.style.backgroundColor = '#ff3385';
            }
        });
    }
}

// Reset answer button styles
function resetAnswerButtons() {
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
        button.style.backgroundColor = '';
    });
}

// Check the submitted answer
function checkAnswer() {
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selectedAnswer === correctAnswer) {
        score++;
        alert("Yippeeeee you got the question right!!!😍😍😍");
    } else {
        alert("You got it wrong honey😔😔😔\nThe correct answer was: " + correctAnswer + "‼️");
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        showResult();
    }

    submitButton.disabled = true;
    submitButton.classList.add("disabled");
    selectedAnswer = null;
    resetAnswerButtons();
}

// Show final result
function showResult() {
    const resultContainer = document.getElementById("result-container");
    const scoreElement = document.getElementById("score");

    scoreElement.textContent = score;

    document.getElementById("quiz-content").style.display = 'none';
    document.getElementById("submit-btn").style.display = 'none';
    resultContainer.style.display = 'block';
}

// Retry button event
document.getElementById("retry-btn").addEventListener("click", () => {
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById("result-container").style.display = 'none';
    document.getElementById("quiz-content").style.display = 'block';
    document.getElementById("submit-btn").style.display = 'block';
    loadQuestion(currentQuestionIndex);
});

// Removed the old: loadQuestion(currentQuestionIndex);
