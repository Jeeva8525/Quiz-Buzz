const quizID = window.location.pathname.split("/").pop();

let singleQuiz=null;
document.body.innerHTML=`<div id="header"></div>
                         <div id="qns-container"></div>
                        <button id="submit-btn">Submit</button>
                        <div id="score"></div>`;

const headerTag = document.getElementById('header');
headerTag.innerHTML=`<div id="header-name">QuizBuzz</div> 
                     <div id="header-logo">(Logo)</div>
                     <div id="settings-contianer">
                          <button id="settings-btn">Settings</button>
                     </div>`;

const qnsContainerTag = document.getElementById('qns-container');


document.getElementById('submit-btn').addEventListener('click',()=>{
    const choices=[];
    for (let i = 1; i <= singleQuiz.qns.length; i++) {
        const selected = document.querySelector(`input[name="qn-${i}"]:checked`);
        if (!selected) {
              choices.push("");
        }
        else{
            choices.push(selected.value)
        }
    }
    
    fetch(`/api/quiz/${quizID}/choices`,{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(choices)

      }).then(()=>{
         window.location.href=`/quiz/${quizID}/submit`;
      })
});



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