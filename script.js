let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;  // Track the selected answer

const submitButton = document.getElementById("submit-btn");

fetch('questions.json')  // or 'questions.txt' if using plain text
    .then(response => response.json())
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
    // If the same option is clicked again, deselect it
    if (selectedAnswer === selected) {
        selectedAnswer = null;
        resetAnswerButtons();
        submitButton.disabled = true;
        submitButton.classList.add("disabled");
    } else {
        // Select the new option
        selectedAnswer = selected;
        // Enable the submit button
        submitButton.disabled = false;
        submitButton.classList.remove("disabled");
        
        // Reset any previous answer button styles
        resetAnswerButtons();

        // Highlight the selected answer
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            if (button.textContent === selected) {
                button.style.backgroundColor = '#ff3385'; // Highlight selected answer
            }
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
    
    if (selectedAnswer === correctAnswer) {
        score++;
        alert("Yippeeeee you got the question right!!!😍😍😍")
    }
    else {
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
