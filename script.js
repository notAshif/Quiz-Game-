const questionElement = document.getElementById("question");
const stepElement = document.getElementById("step");
const stepLineElement = document.getElementById("stepline");
const optionContainer = document.querySelector(".option_container");
const nextButton = document.getElementById('next');
const submitButton = document.getElementById('submit');


let currentQuestionIndex = 0;
let score = 0;
let questions = []


async function generate() {
    const response = await fetch('https://opentdb.com/api.php?amount=6&type=multiple');
    const data = await response.json();
    
    questions = data.results;

    showQuestion(questions[currentQuestionIndex])
    
}

function decodeHTML(html) {
    const text = document.createElement('textarea');
    text.value = html;
    return text.value;
}

function showQuestion(questionData){
    questionElement.innerHTML = decodeHTML(questionData.question);

    stepElement.innerText = `Step ${currentQuestionIndex + 1} of ${questions.length}`;

    optionContainer.innerHTML = '';

    const answer = [...questionData.incorrect_answers, questionData.correct_answer];
    answer.sort(() => Math.random() - 0.5);

    answer.forEach(answer =>{
        let button = document.createElement('button');
        button.innerText = decodeHTML(answer);
        button.classList.add('button');
        button.dataset.correct = answer === questionData.correct_answer;
        button.addEventListener('click', selectAnswer);

        optionContainer.appendChild(button);
    });
}

function selectAnswer(event){
    const selectButton = event.target;

    Array.from(optionContainer.children).forEach(button =>{
        button.classList.remove('selected');
        button.disabled = true;
        setStatus(button, button.dataset.correct === 'true')
    });

    selectButton.classList.add('selected');

    if(selectButton.dataset.correct === 'true'){
        score++;
    }
    
}

function handleNextQuestion(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion(questions[currentQuestionIndex]);
    } else{
        showResult();
    }
}

function showResult(){
    questionElement.innerHTML = `Quiz completed! Your score is:${score}/ Number Of Question ${questions.length}`;
    stepElement.innerHTML = '';
    optionContainer.innerHTML = '';
    submitButton.classList.add('none__Button');
}

function setStatus(element, correct){
    element.classList.remove('correct', 'wrong');
    if(correct){
        element.classList.add('correct');
    } else{
        element.classList.add('wrong');
    }
}




nextButton.addEventListener('click', handleNextQuestion);
submitButton.addEventListener('click', showResult)

generate();
