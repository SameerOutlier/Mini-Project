const nameContainer = document.getElementById('name-container');
const settingsContainer = document.getElementById('settings-container');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const resultContainer = document.getElementById('result-container');
const certificateContainer = document.getElementById('certificate-container');
const resultElement = document.getElementById('result');
const certificateText = document.getElementById('certificate-text');
const startButton = document.getElementById('start-button');
const questionCountInput = document.getElementById('question-count');
const subjectSelect = document.getElementById('subject-select');
const nameInput = document.getElementById('name-input');
const nameSubmit = document.getElementById('name-submit');
const timerElement = document.getElementById('time-left');

let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let userName = '';
let timer;
let timeLeft = 30;

function submitName() {
    userName = nameInput.value.trim();
    if (userName) {
        nameContainer.classList.add('hide');
        settingsContainer.classList.remove('hide');
        settingsContainer.classList.add('show');
    } else {
        alert('Please enter your name');
    }
}

async function fetchQuestions() {
    const questionCount = questionCountInput.value;
    const subject = subjectSelect.value;
    let url;
    if (subject === '19') {
        url = `https://opentdb.com/api.php?amount=${questionCount}&category=18&difficulty=medium&type=multiple`;
    } else if (subject === '30') {
        url = `https://opentdb.com/api.php?amount=${questionCount}&category=17&difficulty=hard&type=multiple`;
    } else if (subject === '31') {
        url = `https://opentdb.com/api.php?amount=${questionCount}&category=18&difficulty=hard&type=multiple`;
    } else {
        url = `https://opentdb.com/api.php?amount=${questionCount}&category=${subject}&type=multiple`;
    }
    const response = await fetch(url);
    const data = await response.json();
    questions = data.results.map(q => ({
        question: q.question,
        answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
        correct: q.correct_answer
    }));
    settingsContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    questionContainer.classList.add('show');
    startTimer();
    showQuestion();
}

function startTimer() {
    timeLeft = 30;
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    clearInterval(timer);
    startTimer();
}

function showQuestion() {
    if (questions.length === 0) {
        console.error('No questions available');
        return;
    }
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        if (answer === currentQuestion.correct) {
            button.dataset.correct = true;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        if (button.dataset.correct) {
            button.classList.add('correct');
        }
    });
    nextButton.classList.remove('hide');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionContainer.classList.remove('show');
    resultContainer.classList.remove('hide');
    resultContainer.classList.add('show');
    resultElement.innerText = `${userName}, you scored ${score} out of ${questions.length}!`;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.remove('show');
    settingsContainer.classList.remove('hide');
    settingsContainer.classList.add('show');
    nameContainer.classList.remove('hide');
    nameContainer.classList.add('show');
}

function generateCertificate() {
    resultContainer.classList.remove('show');
    certificateContainer.classList.remove('hide');
    certificateContainer.classList.add('show');
    certificateText.innerHTML = `<p>This certifies that ${userName} has completed the quiz and scored ${score} out of ${questions.length}.</p>`;
}

function printCertificate() {
    window.print();
}

function startQuiz() {
    fetchQuestions();
}

document.addEventListener('DOMContentLoaded', () => {
    nameContainer.classList.add('show');
    nameSubmit.addEventListener('click', submitName);
    startButton.addEventListener('click', startQuiz);
});
