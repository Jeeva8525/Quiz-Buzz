const quizID = window.location.pathname.split("/").pop();
let singleQuiz=null;
document.body.innerHTML=`<div id="qns-container"></div><button id="submit-btn">Submit</button><div id="score"></div>`;

const qnsContainerTag = document.getElementById('qns-container');


document.getElementById('submit-btn').addEventListener('click',()=>{
    let score=0;
    for (let i = 1; i <= singleQuiz.qns.length; i++) {
        const selected = document.querySelector(`input[name="qn-${i}"]:checked`);
        if (selected && selected.value === singleQuiz.qns[i - 1][1]) {
            score++;
        }
    }
    document.getElementById('score').innerHTML=`${score}`;
});

function render(quiz){
    const {qns} = quiz;
    let option_id;
    let qnNo=0;
    let html="";
    for(let q of qns){
          html+=`<div class="qns"><p>${++qnNo}) ${q[0]}</p>`;
          for(let i=2;i<q.length;i++){
              html+=`<label>
                        <input type="radio" name="qn-${qnNo}" value="${q[i]}">
                        ${q[i]}
                    </label><br>`;
          }
          html+=`</div>`;
    } 
    qnsContainerTag.innerHTML=html;
}

async function main(){
    const response = await fetch(`/api/quiz/${quizID}`);
    singleQuiz= await response.json();
    document.title=singleQuiz.name;
    render(singleQuiz);
}

main();