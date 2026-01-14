

document.body.innerHTML = `<div id="header"></div>
                           <div id="search-bar"></div>
                          <div id="quiz-container"></div>`;

const quizContainerTag = document.getElementById('quiz-container');
const searchBarTag = document.getElementById('search-bar');

searchBarTag.innerHTML=`<a href='/createQuiz'><button id="create-btn">Create Quiz</button></a>
                        <input type="text" id="search-box" placeholder="Search"></input>
                        <select id="topic-drop-down">
                            <option value="">All</option>
                            <option value="sports">Sports</option>
                            <option value="science">Science</option>
                            <option value="programming">Programming</option>
                            <option value="history">History</option>
                            <option value="movies">Movies</option>
                            <option value="music">Music</option>
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

function roundToHalf(x) {
    return (Math.round(x * 2) / 2).toFixed(1);
}



function render(quiz){
    quizContainerTag.innerHTML='';
    for(let id in quiz){
        quizContainerTag.innerHTML+=`
            <div class="quiz">
                <div class="quiz-name">${quiz[id].name}</div>
                <div class="pop-up-div">
                    <button class='pop-btns'>Edit</button>
                    <button class='pop-btns'>Delete</button>
                </div>
                <button class="pop-up"><img src='/images/pop-up.jpg'></button>
                
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
    render(quiz);
}

main()


