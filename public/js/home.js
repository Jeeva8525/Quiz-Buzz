

let html = `<div id="header"></div>
                           <div id="search-bar"></div>
                          <div id="quiz-container"></div>`;
document.body.innerHTML+=html;

const quizContainerTag = document.getElementById('quiz-container');

const searchBarTag = document.getElementById('search-bar');

searchBarTag.innerHTML=`<a href='/createQuiz'><button id="create-btn">Create Quiz</button></a>
                        <input type="text" id="search-box" placeholder="Search"></input>
                        <select id="topic-drop-down">
                            <option value="">All</option>
                        </select>`
                        ;



const dropDownTag= document.getElementById('topic-drop-down');
const searchTag = document.getElementById('search-box');
// const createButton = document.getElementById('create-btn');

/* createButton.addEventListener('click',() => {
    window.location.href = '/quiz/createQuiz';
}) */


const fetchAndRender =async()=>{
      const selectedValue = dropDownTag.value;
      const searchValue = searchTag.value.trim();
      const response=await fetch(`/api/quiz?search=${searchValue}&topic=${selectedValue}`);
      const filtered_quiz=await response.json();
      render(filtered_quiz);
};

dropDownTag.addEventListener('change',fetchAndRender);
searchTag.addEventListener('keyup',fetchAndRender);

let quiz=null;
let topics=null;

function roundToHalf(x) {
    return (Math.round(x * 2) / 2).toFixed(1);
}

function renderTopics(topics){
    let html='';
    topics.forEach((e)=>{
       html+=`<option value="${e}">${e}</option>`
    });

    dropDownTag.innerHTML+=html;
}

function render(quiz){

    quizContainerTag.innerHTML='';
    for(let id in quiz){
        quizContainerTag.innerHTML+=`
            <div class="quiz">
                <div class="quiz-name"><abbr title="${quiz[id].name} (${quiz[id].topic})">${quiz[id].name}</abbr></div>
                <div class="pop-up-div">
                    <a href="/quiz/${id}/edit"><button class='pop-btns' class='edit-btn'>Edit</button></a>
                    <a href="/quiz/${id}/delete"><button class='pop-btns class='delete-btn'>Delete</button></a>
                </div>
                <button class="pop-up"><img src='/images/pop-up.png'></button>
                
                <div class="quiz-topic">category:${quiz[id].topic}</div>
                <hr>
                <div class="quiz-avgScore">Avg score:${quiz[id].avgScore.toFixed(2)}(${((quiz[id].avgScore/quiz[id].qns.length)*100).toFixed(2)}%)</div>
                <div class="quiz-highestScore">Highest score:${quiz[id].highestScore}(${((quiz[id].highestScore/quiz[id].qns.length)*100).toFixed(2)}%)</div>
                <div class="quiz-btn-container"> 
                     <a href="/quiz/${id}">
                          <button class="quiz-btn">START QUIZ</button>
                     </a>
                </div>
                <div class="quiz-rating">
                    <img src='images/star-ratings/${roundToHalf(quiz[id].rating)}.jpg'>
                </div>
                <div class="quiz-rating-display">
                        ${quiz[id].rating.toFixed(2)}/5.0 (${quiz[id].totalReviews})
                </div>
            </div>`;

            const popUps = document.getElementsByClassName('pop-up');
            const popDivs=document.getElementsByClassName('pop-up-div');
            for(let i=0;i<popUps.length;i++){
                popUps[i].addEventListener('mouseover',()=>{
                     popDivs[i].style.display='block';
                });
                popUps[i].addEventListener('mouseleave',()=>{
                     popDivs[i].style.display='none';
                });
                popDivs[i].addEventListener('mouseover',()=>{
                     popDivs[i].style.display='block';
                });
                popDivs[i].addEventListener('mouseleave',()=>{
                     popDivs[i].style.display='none';
                });
            }
    }
}

async function main(){
    const response=await fetch('/api/quiz');
    quiz= await response.json();
    const response2=await fetch('/api/topics');
    topics= await response2.json();
    renderTopics(topics);
    render(quiz);
    
}

main()


