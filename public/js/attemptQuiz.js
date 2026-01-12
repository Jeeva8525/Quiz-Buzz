const quizID = window.location.pathname.split("/").pop();

document.body.innerHTML=`<div id="qns-container"></div>`;

const qnsContainerTag = document.getElementById('qns-container');

function render(quiz){
    const {qns} = quiz;
    let option_id;
    let qnNo=0;
    let html="";
    for(let q of qns){
          html+=`<div class="qns"><p>${++qnNo}) ${q[0]}</p>`;
          for(let i=2;i<q.length;i++){
              html+=`<input type="radio" name="${qnNo}" value="${q[i]}">
                      <label>${q[i]}</label><br>`;
          }
          html+=`</div>`;
    } 
    qnsContainerTag.innerHTML=html;
}

async function main(){
    const response = await fetch(`/api/quiz/${quizID}`);
    const SingleQuiz= await response.json();
    document.title=SingleQuiz.name;
    render(SingleQuiz);
}

main();