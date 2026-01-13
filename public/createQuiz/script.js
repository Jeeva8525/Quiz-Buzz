const quizName = document.getElementById('quizName');
const quizTopic = document.getElementById('quizTopic');
const question = document.getElementById('question');

const submitButton = document.getElementById('submitButton');

const optionsContainer = document.getElementById('optionsContainer');
const addOptionsButton = document.getElementById('addOptionsButton');

let quesNo = 1;
let optionsNo = 1;

function addOptions(){
    /* optionsContainer.innerHTML += `
        <input type="text" id='question-${quesNo}-option-${++optionsNo}'>
    ` */ 

    //someone check why the above code is not adding more than 2 input boxes ...
    const inputElement = document.createElement('input');
    inputElement.type = 'text'
    inputElement.id = `question-${quesNo}-option-${++optionsNo}`;
    optionsContainer.append(inputElement)

}

addOptionsButton.addEventListener('click',()=>{
    addOptions();
});


// const sendInputValues = () => {
    
// }

// submitButton.addEventListener('click',sendInputValues);