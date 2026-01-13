const quizID = window.location.pathname.split("/").pop();

let singleQuiz=null;
document.body.innerHTML=`<div id="header"></div>
                         <div id="qns-container"></div>
                        <button id="submit-btn">Submit</button>
                        <div id="score"></div>`;


window.addEventListener('pageshow', () => {
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.checked = false);
});

const qnsContainerTag = document.getElementById('qns-container');


document.getElementById('submit-btn').addEventListener('click',async()=>{
    let score=0;
    const choices=[];
    for (let i = 1; i <= singleQuiz.qns.length; i++) {
        const selected = document.querySelector(`input[name="qn-${i}"]:checked`);
        if (!selected) {
              choices.push("");
        }
        else{
            choices.push(selected.value)
        }
        if(selected && selected.value===singleQuiz.qns[i-1][1]){
            score++;
        }
    }
    const response = await fetch('/api/generateID');
    const submitID = await response.json();
    await fetch(`/api/quiz/${quizID}/choices/${submitID}`,{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(choices)

      }).then(()=>{
         window.location.href=`/quiz/${quizID}/submit/${submitID}`;
      })
    await updateScores(score);
    
});

async function updateScores(score){
    const updatedQuiz =structuredClone(singleQuiz);
    let { attempts, avgScore, highestScore } = updatedQuiz;
    updatedQuiz.avgScore=(avgScore*attempts+score)/(attempts+1);
    updatedQuiz.attempts++;
    updatedQuiz.highestScore = (score>highestScore)?score:highestScore;
    console.log(updatedQuiz);
    await fetch(`/api/quiz/${quizID}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(updatedQuiz)
    });
    console.log("Hi");
}


function render(quiz){
    const {qns} = quiz;
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
    const radios = document.querySelectorAll('input[type="radio"]');

    radios.forEach(radio => {
        radio.addEventListener('click', function() {
            if (this.wasChecked) {
                this.checked = false;
            }
            this.wasChecked = this.checked;
        });
    });
}

async function main(){
    const response = await fetch(`/api/quiz/${quizID}`);
    singleQuiz= await response.json();
    document.title=singleQuiz.name;
    render(singleQuiz);
}

main();