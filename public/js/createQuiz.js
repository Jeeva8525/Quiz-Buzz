const quizName = document.getElementById('quizName');
const quizTopic = document.getElementById('quizTopic');

const submitButton = document.getElementById('submitButton');

const addOptionsButton = document.getElementById('addOptionsButton');

let quesNo = 1;
let optionsNo = [-1, 2]; //optionsNo is 1-based-index  // first question is already created with two default options => optionsNo[1] = 2
 
function addOptions(qNo) {
    const correctAnswerQn = document.getElementById('correctAnswerQn' + qNo);
    // console.log({qNo});
    const optionsContainer = document.getElementById(`options-${qNo}-container`);
    optionsContainer.insertAdjacentHTML('beforeend', `
        <div class="option">
            <input 
                type="text" 
                id='question-${qNo}-option-${++optionsNo[qNo]}'
                onblur="updateCorrectAnswerChoices(event,${qNo},${optionsNo[qNo]})"
            >
            <button onclick="removeOption(event)">X</button>
        </div>
    ` )

    correctAnswerQn.innerHTML += `
        <option id='answer-${qNo}-option-${optionsNo[qNo]}'>
        </option>
    `

}


function updateCorrectAnswerChoices(event, qno, ano) {
    const selectOption = document.getElementById(`answer-${qno}-option-${ano}`);
    selectOption.innerHTML = event.target.value;
}

function removeOption(event) {
    const outerDiv = event.target.parentElement; // get the div by using the x button's event
    outerDiv.remove();
    const idNameArray = outerDiv.children[0].id.split('-'); // select the input tag and access its id name
    // console.log(idNameArray)
    const selectOption = document.getElementById(`answer-${parseInt(idNameArray[1])}-option-${parseInt(idNameArray[3])}`);
    selectOption.remove();
}




function addQuestions() {

    optionsNo.push(0);

    const questionContainer = document.getElementsByClassName('quiz-detail')[2];

    questionContainer.insertAdjacentHTML('beforeend', `
        <div class="question-container">
            <p>Question Name <button onclick="removeQuestion(event)">X</button></p>
            <input type="text" id="question-${++quesNo}-name" placeholder="Question Name">
            <div id="options-${quesNo}-container">
                <p>Options<button id="addOptionsButton" onclick="addOptions(${quesNo})">Add</button></p>
                <div class="option">
                    <input 
                        type="text" 
                        id='question-${quesNo}-option-${++optionsNo[quesNo]}'
                        onblur="updateCorrectAnswerChoices(event,${quesNo},${optionsNo[quesNo]})"
                    > 
                </div>
                <div class="option">
                    <input 
                        type="text" 
                        id='question-${quesNo}-option-${++optionsNo[quesNo]}'
                        onblur="updateCorrectAnswerChoices(event,${quesNo},${optionsNo[quesNo]})"
                    > 
                </div>
            </div>

            <p>Correct Answer</p>
            <select name="correctAnswerQn${quesNo}" id="correctAnswerQn${quesNo}">
                <option id="answer-${quesNo}-option-1"></option>
                <option id="answer-${quesNo}-option-2"></option>
            </select>
        </div>
    `)


}

function removeQuestion(event) {
    const outerDiv = event.target.parentElement.parentElement; // get the div by using the x button's event
    outerDiv.remove();
}

function submit() {
    const bodyObject = {}
    const qns = [];
    let questions;
    for (let x = 1; x <= quesNo; x++) {
        questions = [];
        const elt = document.getElementById(`question-${x}-name`);
        if (!elt)
            continue;

        questions.push(elt.value);

        const ansElt = document.getElementById(`correctAnswerQn${x}`)
        const ans = ansElt.options[ansElt.selectedIndex].text;
        questions.push(ans);

        for (let y = 0; y < ansElt.options.length; y++) {
            questions.push(ansElt.options[y].text)
        }
        qns.push(questions)
    }
    // console.log(qns);

    bodyObject["name"] = document.getElementById('quizName').value;
    bodyObject["topic"] = document.getElementById('quizTopic').value;
    bodyObject["qns"] = qns;
    bodyObject["attempts"] = 0;
    bodyObject["avgScore"] = 0.0;
    bodyObject["highestScore"] = 0.0;
    bodyObject["rating"] = 0.0;
    bodyObject["totalReviews"] = 0;

    console.log(bodyObject)

    fetch('/api/quiz/create',
        {
            method: 'POST',
            headers : {
                'content-type' : 'application/json',
            },
            body : JSON.stringify(bodyObject)
        }
    )

    console.log('exited')
}