const Tag=document.getElementById('dialog');
const URLpath = window.location.pathname.split("/");
const quizID= URLpath[URLpath.length-2];
let singleQuiz;


async function main(){
    const response = await fetch(`/api/quiz/${quizID}`);
    singleQuiz = await response.json();
    Tag.innerHTML=`Do you want to delete ${singleQuiz.name}?<hr>
                   <a href="/"><button class='btn'>Go Back</button></a>
                   <button class='btn'>Yes, I'm Sure</button>`;
    
    document.getElementsByClassName('btn')[1].addEventListener('click',async()=>{
        await fetch(`/api/quiz/${quizID}`, {
            method: 'DELETE',
        });
        window.location.href='/';
    });
}

main();
