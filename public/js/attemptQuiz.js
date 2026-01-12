const quizID = window.location.pathname.split("/").pop();

document.body.innerHTML=`<div id="qns-container"></div>`;

const qnsContainerTag = document.getElementById('qns-container');

function render(quiz){
    const {qns} = quiz;
    let qnNo=0;
    for(let q of qns){
          qnsContainerTag.innerHTML+=`<div class="qns">${q[0]}`;
          let choice=0;
          for(let i=2;i<q.length;i++){
              qnsContainerTag.innerHTML+=`${++choice} ${q[i]} <input type="radio" name="${qnNo}" value="${q[i]}">`;
          }
          ++qnNo;
          qnsContainerTag.innerHTML+=`</div>`;
    } 
}

async function main(){
    const response = await fetch(`/api/quiz/${quizID}`);
    const SingleQuiz= await response.json();
    document.title=SingleQuiz.name;
    render(SingleQuiz);
}

main();