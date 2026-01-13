
document.body.innerHTML+=`<div id="summary"></div>
                     <div id="score"></div>
                     <div id="rating-box">
                     <div id="stars">
                        <button class="star"><img src="/images/star/off.jpg"></button>
                        <button class="star"><img src="/images/star/off.jpg"></button>
                        <button class="star"><img src="/images/star/off.jpg"></button>
                        <button class="star"><img src="/images/star/off.jpg"></button>
                        <button class="star"><img src="/images/star/off.jpg"></button>
                     </div>
                     <div id="btns-box"><button class="rate-btn">No, Thanks</button><button class="rate-btn">Rate</button></div></div>`;


const URLpath = window.location.pathname.split("/");
const quizID= URLpath[URLpath.length-3];
const submitID = URLpath[URLpath.length-1];

let singleQuiz;
let choices={};
let score=0;

rateFlag=sessionStorage.getItem(`rate-${submitID}`)||"0";

if(rateFlag==="1"){
    let html='';
    html+=`<a href="/"><button id="back-to-home">Go Back To Home</button><a>`;
    document.getElementById('rating-box').innerHTML=html;
}


if(rateFlag==="0"){
        document.getElementsByClassName('rate-btn')[0].addEventListener('click',async()=>{
            let html='';
            html+=`<a href="/"><button id="back-to-home">Go Back To Home</button><a>`;
            sessionStorage.setItem(`rate-${submitID}`,"1");
            document.getElementById('rating-box').innerHTML=html;;
        })

        document.getElementsByClassName('rate-btn')[1].addEventListener('click',async()=>{
            sessionStorage.setItem(`rate-${submitID}`,"1");
            const updatedQuiz=structuredClone(singleQuiz);
            let {rating}=singleQuiz;
            let {totalReviews} = singleQuiz;
            let newRating = ((rating*totalReviews+starsRating)*100/(totalReviews+1))/100;
            console.log(starsRating,newRating);
            let html='';
            updatedQuiz.rating=newRating;
            updatedQuiz.totalReviews++;
            await fetch(`/api/quiz/${quizID}`,{
                method:'PUT',
                headers:{
                    'content-type':'application/json'
                },
                body:JSON.stringify(updatedQuiz)

            })

            html+=`<a href="/"><button id="back-to-home">Go Back To Home</button><a>`;
            document.getElementById('rating-box').innerHTML=html;;
        })

        let starsRating=0;

        const stars=document.getElementsByClassName('star');
        for(let i=0;i<5;i++){
            stars[i].addEventListener('mouseover',()=>{
                for(let j=0;j<=i;j++){
                    stars[j].querySelector('img').src="/images/star/on.jpg";
                }
                for(let j=i+1;j<5;j++){
                    stars[j].querySelector('img').src="/images/star/off.jpg";;
                }
            });
            stars[i].addEventListener('mouseleave',()=>{
                for(let j=0;j<starsRating;j++){
                    stars[j].querySelector('img').src="/images/star/on.jpg";
                }
                for(let j=starsRating;j<5;j++){
                    stars[j].querySelector('img').src="/images/star/off.jpg";
                }
            });
            
        }

        stars[0].addEventListener('click',()=>{
            if(starsRating===1){
                starsRating=0;
            }
            else{
                starsRating=1;
            }
        })

        for(let i=1;i<5;i++){
            stars[i].addEventListener('click',()=>{
                starsRating=i+1;
            })
        }


}

function render(singleQuiz,choices){
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


