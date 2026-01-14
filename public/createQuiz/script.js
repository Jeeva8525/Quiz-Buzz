const quizName = document.getElementById('quizName');
const quizTopic = document.getElementById('quizTopic');
const questionName = document.getElementById('questionName');

const submitButton = document.getElementById('submitButton');

const addOptionsButton = document.getElementById('addOptionsButton');

let quesNo = 1;
let optionsNo = [-1,1];

function addOptions(qNo) {
    const correctAnswerQn = document.getElementById('correctAnswerQn'+qNo);
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
    // console.log('ano',ano);
    
    // console.log(`answer-${qno}-option-${ano}`);
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
    // console.log(questionContainer);
    
    questionContainer.insertAdjacentHTML ('beforeend', `
        <div class="question-container">
            <input type="text" id=question-${++quesNo}-name" placeholder="Question Name">
            <div id="options-${quesNo}-container">
                <p>Options<button id="addOptionsButton" onclick="addOptions(${quesNo})">Add</button></p>
                <div class="option">
                    <input 
                        type="text" 
                        id='question-${quesNo}-option-${++optionsNo[quesNo]}'
                        onblur="updateCorrectAnswerChoices(event,${quesNo},${optionsNo[quesNo]})"
                    > 
                    <button>X</button>
                </div>
            </div>

            <p>Correct Answer</p>
            <select name="correctAnswerQn${quesNo}" id="correctAnswerQn${quesNo}">
                <option id="answer-${quesNo}-option-1"></option>
            </select>
        </div>
    `)
        

}