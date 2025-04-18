document.getElementById("start-btn").addEventListener("click", function() {
    document.getElementById("intro-screen").style.display = "none";
    document.querySelector(".quiz-container").style.display = "block";
});

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;  // Track the selected answer

const submitButton = document.getElementById("submit-btn");

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

// Function to load the current question
function loadQuestion(index) {
    const questionData = questions[index];
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");

    questionElement.innerHTML = `
    <h2>${questionData.question}</h2>
    ${questionData.image ? `<img src="${questionData.image}" alt="question image" class="question-img">` : ''}
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

// Function to handle answer selection/deselection
function selectAnswer(selected) {
    const answerButtons = document.querySelectorAll('.answer-btn');

    if (selectedAnswer === selected) {
        // Deselect if clicked again
        selectedAnswer = null;
        answerButtons.forEach(button => {
            button.classList.remove("selected", "dimmed");
        });
        submitButton.disabled = true;
        submitButton.classList.add("disabled");
    } else {
        selectedAnswer = selected;
        submitButton.disabled = false;
        submitButton.classList.remove("disabled");

        answerButtons.forEach(button => {
            const isSelected = button.textContent === selected;
            button.classList.toggle("selected", isSelected);
            button.classList.toggle("dimmed", !isSelected);
        });
    }
}

// Function to reset all answer buttons' styles
function resetAnswerButtons() {
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
        button.style.backgroundColor = ''; // Reset the background color after deselection or new selection
    });
}

// Function to check the answer
function checkAnswer() {
    const correctAnswer = questions[currentQuestionIndex].answer;
    const correctSound = new Audio ('https://www.myinstants.com/media/sounds/extremely-loud-correct-buzzer.mp3');
    const incorrectSound = new Audio ('https://www.myinstants.com/media/sounds/extremely-loud-incorrect-buzzer_0cDaG20.mp3');
    
    if (selectedAnswer === correctAnswer) {
        score++;
        correctSound.play();
        alert("Yippeeeee you got the question right!!!😍😍😍")

    }
    else {
        incorrectSound.play();
        alert("You got it wrong honey😔😔😔\nThe correct answer was: " + correctAnswer +"‼️");

    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion(currentQuestionIndex);
    } else {
        showResult();
    }

    // Disable submit button after submission
    submitButton.disabled = true;
    submitButton.classList.add("disabled");
    selectedAnswer = null;  // Reset selected answer
    resetAnswerButtons();
}

// Function to show the result at the end of the quiz
function showResult() {
    const resultContainer = document.getElementById("result-container");
    const scoreElement = document.getElementById("score");
    
    scoreElement.textContent = score;
    
    document.getElementById("quiz-content").style.display = 'none';
    document.getElementById("submit-btn").style.display = 'none';
    resultContainer.style.display = 'block';
}

// Event listener for the submit button
submitButton.addEventListener("click", checkAnswer);

// Event listener for retrying the quiz
document.getElementById("retry-btn").addEventListener("click", () => {
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById("result-container").style.display = 'none';
    document.getElementById("quiz-content").style.display = 'block';
    document.getElementById("submit-btn").style.display = 'block';
    loadQuestion(currentQuestionIndex);
});

// Initialize the quiz
loadQuestion(currentQuestionIndex);
