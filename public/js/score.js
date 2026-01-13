
document.body.innerHTML+=`<div id="summary"></div>
                     <div id="score"></div>
                     <div id="rating-box"></div>`;
const URLpath = window.location.pathname.split("/");
const quizID= URLpath[URLpath.length-3];
const submitID = URLpath[URLpath.length-1];

let singleQuiz;
let choices={};

function render(singleQuiz,choices){
    let score=0;
    const Tag= document.getElementById('summary');
    let html=
                `<table>
                       <thead>
                            <tr>
                              <th></th>
                              <th>correct answer</th>
                              <th>your answer</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
    for(let i=0;i<singleQuiz.qns.length;i++){
        html+=`<tr>
                           <td>${singleQuiz.qns[i][0]}</td>
                           <td class='crt-ans'>${singleQuiz.qns[i][1]}</td>
                           <td class='your-ans'>${choices[i] || "----"}</td>
                        </tr>`;
                
    }
    html+=`</tbody></table>`;
    Tag.innerHTML=html;
    const ansTags = document.getElementsByClassName('your-ans');
    for(let i=0;i<singleQuiz.qns.length;i++){
        if(choices[i]==singleQuiz.qns[i][1]){
            ansTags[i].classList.add('ans-match');
            score++;
        }
        else{
            ansTags[i].classList.add('ans-mismatch');
        }
    }

    document.getElementById('score').innerHTML=`Your Scored : ${score}/${singleQuiz.qns.length}`
    document.getElementById('score').style.display = "block"

}
async function main(){
    const response1 = await fetch(`/api/quiz/${quizID}/choices/${submitID}`);
    choices = await response1.json();
    const response2 = await fetch(`/api/quiz/${quizID}`);
    singleQuiz = await response2.json();
    document.title = `${singleQuiz.name} | score`;
    render(singleQuiz,choices)
    
}

main();
