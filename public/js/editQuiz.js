const quizId = (window.location.pathname.split('/'))[2];

const quizName = document.getElementById('quizName');
const topicDropDown = document.getElementById('topic-drop-down');

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
                autocomplete="off"
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
            <p>Question <button onclick="removeQuestion(event)">X</button></p>
             <div class="qn-no"></div><input type="text" id="question-${++quesNo}-name" placeholder="Question" autocomplete="off">
            <div id="options-${quesNo}-container">
                <p>Options<button id="addOptionsButton" onclick="addOptions(${quesNo})">Add</button></p>
                <div class="option">
                    <input 
                        type="text" 
                        id='question-${quesNo}-option-${++optionsNo[quesNo]}'
                        onblur="updateCorrectAnswerChoices(event,${quesNo},${optionsNo[quesNo]})"
                        autocomplete="off"
                    > 
                </div>
                <div class="option">
                    <input 
                        type="text" 
                        id='question-${quesNo}-option-${++optionsNo[quesNo]}'
                        onblur="updateCorrectAnswerChoices(event,${quesNo},${optionsNo[quesNo]})"
                        autocomplete="off"
                    > 
                </div>
            </div>

            <p>Correct Answer</p>
            <select name="correctAnswerQn${quesNo}" id="correctAnswerQn${quesNo}">
                <option selected disabled value=''>Select Answer</option>
                <option id="answer-${quesNo}-option-1"></option>
                <option id="answer-${quesNo}-option-2"></option>
            </select>
        </div>
        
    `);

    const qnNos = document.getElementsByClassName('qn-no');
    for (let i = 0; i < qnNos.length; i++) {
        qnNos[i].textContent = `${i + 1}) `;
    }


}

function isNotEmpty() {
    const inputs = document.querySelectorAll("input[type='text']");
    for (let i of inputs) {
        if (i.value.trim() == '') {
            return false;
        }
    }
    const dropDowns = document.querySelectorAll("select");
    for (let i of dropDowns) {
        if (i.value === '') {
            return false;
        }
    }
    return true;
}

function removeQuestion(event) {
    const outerDiv = event.target.parentElement.parentElement; // get the div by using the x button's event
    outerDiv.remove();
    const qnNos = document.getElementsByClassName('qn-no');
    for (let i = 0; i < qnNos.length; i++) {
        qnNos[i].textContent = `${i + 1}) `;
    }
}

function submit() {
    if (!isNotEmpty()) {
        alert('Fill all the fields');
        return;
    }

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

        for (let y = 1; y < ansElt.options.length; y++) {
            questions.push(ansElt.options[y].text)
        }
        qns.push(questions)
    }
    // console.log(qns);

    bodyObject["name"] = document.getElementById('quizName').value;
    bodyObject["topic"] = document.getElementById('topic-drop-down').value;
    bodyObject["qns"] = qns;
    bodyObject["attempts"] = 0;
    bodyObject["avgScore"] = 0.0;
    bodyObject["highestScore"] = 0.0;
    bodyObject["rating"] = 0.0;
    bodyObject["totalReviews"] = 0;

    // console.log(bodyObject)

    fetch(`/api/quiz/${quizId}`,
        {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(bodyObject)
        }
    )
    window.location.href = '/';
    // console.log('exited')
}

async function fillDefaultValues() {

    const response = await fetch('/api/quiz');
    const quiz = await response.json();
    const quesObject = quiz[quizId];

    quizName.value = quesObject["name"];
    topicDropDown.value = quesObject["topic"];

    let qns = quesObject['qns'];
    addQuestionsDefault(qns[0], true); // non - erasable
    for (let x = 1; x < qns.length; x++) {
        addQuestionsDefault(qns[x]);
    }



}

fillDefaultValues(); //call the initial function to render all default values

function addQuestionsDefault(qn, isFirstQuestion) { //adds a single question //qn is a element of qns attribute in quiz (i.e, qn = quiz["qns"][x])
    optionsNo.push(0);

    const questionContainer = document.getElementsByClassName('quiz-detail')[2];

    let quesHTML = "";
    if (isFirstQuestion) { // if it is first question then the X button should not be present
        quesHTML = `
            <div class="question-container">
                <p>Question</p>
                 <div class="qn-no"></div>
                 <input type="text" 
                 id="question-${++quesNo}-name" 
                 placeholder="Question" autocomplete="off"
                 value = "${qn[0]}"
                >
                <div id="options-${quesNo}-container">
    
    
    
    
                    <p>Options<button id="addOptionsButton" onclick="addOptions(${quesNo})">Add</button></p>
        `
        isFirstQuestion = false;
    }
    else {
        quesHTML = `
            <div class="question-container">
                <p>Question <button onclick="removeQuestion(event)">X</button></p>
                 <div class="qn-no"></div>
                 <input type="text" 
                 id="question-${++quesNo}-name" 
                 placeholder="Question" autocomplete="off"
                 value = "${qn[0]}"
                >
                <div id="options-${quesNo}-container">
    
    
    
    
                    <p>Options<button id="addOptionsButton" onclick="addOptions(${quesNo})">Add</button></p>
        `

    }




    // 2 iterations to add non - erasable options
    for (let x = 2; x < 4; x++) {
        // addOptionsDefault(quesNo,qn[x]);


        quesHTML += `
            <div class="option">
            <input 
                type="text" 
                id='question-${quesNo}-option-${++optionsNo[quesNo]}'
                onblur="updateCorrectAnswerChoices(event,${quesNo},${optionsNo[quesNo]})"
                value = "${qn[x]}"
                autocomplete="off"
            >
        </div>
        `
    }

    for (let x = 4; x < qn.length; x++) {
        quesHTML += `
            <div class="option">
            <input 
                type="text" 
                id='question-${quesNo}-option-${++optionsNo[quesNo]}'
                onblur="updateCorrectAnswerChoices(event,${quesNo},${optionsNo[quesNo]})"
                value = "${qn[x]}"
                autocomplete="off"
            >
            <button onclick="removeOption(event)">X</button>
        </div>
        `
    }





    quesHTML += `
        </div>

            <p>Correct Answer</p>
            <select name="correctAnswerQn${quesNo}" id="correctAnswerQn${quesNo}">
                <option selected disabled value=''>Select Answer</option>
    `

    const correctAns = qn[1];
    for (let x = 2; x < qn.length; x++) {
        if (qn[x] === correctAns) {
            quesHTML += `
                <option id="answer-${quesNo}-option-${x - 1}" selected>${qn[x]}</option>
            `
        }
        else {
            quesHTML += `
                <option id="answer-${quesNo}-option-${x - 1}">${qn[x]}</option>
            `

        }
    }

    quesHTML += `
        </select>
        </div>
    `

    questionContainer.insertAdjacentHTML('beforeend', quesHTML);

    /*
    
        questionContainer.insertAdjacentHTML('beforeend', `
            <div class="question-container">
                <p>Question <button onclick="removeQuestion(event)">X</button></p>
                 <div class="qn-no"></div>
                 <input type="text" 
                 id="question-${++quesNo}-name" 
                 placeholder="Question" autocomplete="off"
                 value = ${qn[0]}
                >
                <div id="options-${quesNo}-container">
    
    
    
    
                    <p>Options<button id="addOptionsButton" onclick="addOptions(${quesNo})">Add</button></p>
    
    
    
    
    
                    <div class="option">
                        <input 
                            type="text" 
                            id='question-${quesNo}-option-${++optionsNo[quesNo]}'
                            onblur="updateCorrectAnswerChoices(event,${quesNo},${optionsNo[quesNo]})"
                            autocomplete="off"
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
                    <option selected disabled value=''>Select Answer</option>
                    <option id="answer-${quesNo}-option-1"></option>
                    <option id="answer-${quesNo}-option-2"></option>
                </select>
            </div>
            
        `);
    
        const qnNos = document.getElementsByClassName('qn-no');
        for(let i=0;i<qnNos.length;i++){
            qnNos[i].textContent=`${i+1}) `;
        }
    */
}

/* function addOptionsDefault(qNo,value) {
    const correctAnswerQn = document.getElementById('correctAnswerQn' + qNo);
    // console.log({qNo});
    const optionsContainer = document.getElementById(`options-${qNo}-container`);
    optionsContainer.insertAdjacentHTML('beforeend', `
        <div class="option">
            <input 
                type="text" 
                id='question-${qNo}-option-${++optionsNo[qNo]}'
                onblur="updateCorrectAnswerChoices(event,${qNo},${optionsNo[qNo]})"
                value = ${value}
            >
            <button onclick="removeOption(event)">X</button>
        </div>
    ` )

    correctAnswerQn.innerHTML += `
        <option id='answer-${qNo}-option-${optionsNo[qNo]}'>
            ${value}
        </option>
    `

} */