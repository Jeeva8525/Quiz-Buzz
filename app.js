const express = require('express');
const app = express();

const fs= require('fs');
const path = require('path');

app.use(express.static('./public'));

let  quiz={};

app.get('/test', (req, res) => {
    res.send('API working');
});

app.get("/api/quiz/:quizID",(req,res)=>{
    const {quizID} = req.params;
    if(!quiz[quizID]){
        return res.status(404).json({success:false,msg:'no such quiz exists!'});
    }
    return res.status(200).json(quiz[quizID]);
});

app.all('/*',(req,res)=>{
    res.status(404).json({success:'false',msg:'no such page exists'});
})

function startServer(){

    quiz = JSON.parse(fs.readFileSync(path.resolve(__dirname,'database/quiz.json'),'utf-8'));
    app.listen(5000,()=>{
    console.log("server is listening to port 5000");   
    });
}

startServer();

