

    document.body.innerHTML = `<div id="quiz-container"></div>`;
    const quizContainerTag = document.getElementById('quiz-container');
    let quiz=null;

function roundToHalf(x) {
    return (Math.round(x * 2) / 2).toFixed(1);
}

async function main(){
    const response=await fetch('/api/quiz');
    quiz= await response.json();
    console.log(quiz);
    quizContainerTag.innerHTML='';
    for(let id in quiz){
        quizContainerTag.innerHTML+=`
            <div class="quiz">
                <div class="quiz-name">${quiz[id].name}</div>
                
                <div class="quiz-topic">category:${quiz[id].topic}</div>
                <hr>
                <div class="quiz-avgScore">Avg score:${quiz[id].avgScore}</div>
                <div class="quiz-highestScore">Highest score:${quiz[id].highestScore}</div>
                <div class="quiz-btn-container"> 
                     <button class="quiz-btn">START QUIZ</button>
                </div>
                <div class="quiz-rating">
                    <img src='images/star-ratings/${roundToHalf(quiz[id].rating)}.jpg'>
                </div>
                <div class="quiz-rating-display">
                        ${quiz[id].rating}/5.0 (${quiz[id].totalReviews})
                </div>
            </div>`;
        }
}

main()


