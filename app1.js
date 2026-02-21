import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 } from 'uuid';
import { createQuizValidationSchema } from './utils/validationSchemas.js';
import { validationResult, matchedData, checkSchema } from 'express-validator';
import { log } from 'console'; //instead of console.log(), can also use log();
import {connectToDb,getDB } from './DBconnection/db.js';
import { ObjectId } from 'mongodb';



const __filePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filePath)

const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let quiz={};
let topics=[];
let choices=[];


app.get("/api/quiz/:quizID", (req, res) => {
    const { quizID } = req.params;
    if (!quiz[quizID]) {
        return res.status(404).json({ success: false, msg: 'no such quiz exists!' });
    }
    return res.status(200).json(quiz[quizID]);
});

app.get("/api/quiz", (req, res) => {
    const { search, topic } = req.query;
    if (!search && !topic) {
        return res.status(200).json(quiz);
    }
    let filtered_quiz = {};

    for (let id in quiz) {
        let topicMatch = true;
        let searchMatch = true;

        if (topic) {
            topicMatch = quiz[id].topic.toLowerCase() === topic.toLowerCase();
        }
        if (search) {
            searchMatch = quiz[id].name.toLowerCase().includes(search.toLowerCase());
        }

        if (topicMatch && searchMatch) {
            filtered_quiz[id] = quiz[id];
        }
    }
    return res.status(200).json(filtered_quiz);

});

app.get("/api/topics",(req, res) => {
    return res.status(200).json(topics);
});

app.post("/api/quiz/create",
    checkSchema(createQuizValidationSchema),
    async (req, res) => {
        const validResult = validationResult(req);
        if (!validResult.isEmpty())
        {
            return res.status(400).json({error: validResult.array()})
        }

        let newID
        do {
            newID = v4();
        } while (quiz[newID]);

        quiz[newID] =req.body;
        let insertObj = {_id:newID,...req.body};
        let result = await db.collection('quiz').insertOne(insertObj)
        if(result.acknowledged)
           return res.status(201).json({ success: true, msg: "New quiz created" })
        else{
           return res.status(400).json({ success: false, msg: "New quiz is not created" })
        } 

});

app.put("/api/quiz/:quizId", async(req, res) => {
    let quizId = req.params.quizId;
    if (!quiz[quizId]) {
        return res.status(404).json({ success: false, msg: "No such quiz" })
    }
    let body = req.body;
    quiz[quizId] = { ...quiz[quizId], ...body };
    let result = await db.collection('quiz').updateOne({_id:quizId},{$set:body});
    if(result.matchedCount===1){
       return res.status(200).json({ success: true, msg: `quiz "${quiz[quizId]["name"]}" updated ` });
    }
    else{
        return res.status(400).json({success:false,msg:'quiz not updated'});
    }
})

app.delete("/api/quiz/:quizId", async (req, res) => {
    let quizId = req.params.quizId;
    if (!quiz[quizId]) {
        return res.status(404).json({ success: false, msg: "No such quiz" })
    }
    let quizName = quiz[quizId]["name"];
    delete quiz[quizId]
    let result = await db.collection('quiz').deleteOne({_id:quizId});
    if(result.deletedCount===1){
       return res.status(200).json({ success: true, msg: `quiz ${quizName} deleted`});
    }
    else{
        return res.status(404).json({success:false,msg:'quiz not deleted'});
    }
})

app.get('/api/generateID',(req,res)=>{
    return res.status(200).json(v4());
});

app.post("/api/quiz/:quizID/choices/:submitID",(req,res)=>{
     choices[req.params.quizID]=choices[req.params.quizID] || {};
     choices[req.params.quizID][req.params.submitID]=req.body;
     return res.sendStatus(200);
});

app.get("/api/quiz/:quizID/choices/:submitID",(req,res)=>{
     res.status(200).json(choices[req.params.quizID][req.params.submitID]);
});

app.get("/quiz/:quizID",(req,res)=>{
    return res.status(200).sendFile(path.resolve(__dirname,'./public/attemptQuiz/index.html'));
});

app.get("/quiz/:quizID/edit",(req,res)=>{
    return res.status(200).sendFile(path.resolve(__dirname,'./public/editQuiz/index.html'));
});

app.get("/quiz/:quizID/delete",(req,res)=>{
    return res.status(200).sendFile(path.resolve(__dirname,'./public/deleteQuiz/index.html'));
});

app.get('/quiz/:quizID/submit/:submitID',(req,res)=>{
    return res.status(200).sendFile(path.resolve(__dirname,'./public/score/index.html'));
});

app.get('/createQuiz',(req,res) => {
    res.status(200).sendFile(path.resolve(__dirname,'./public/createQuiz/index.html'))
})

app.all('/*', (req, res) => {
    res.status(404).sendFile(path.resolve(__dirname,'./public/error/index.html'));
});


let db=null;
async function startServer() {
  try {
    await connectToDb();
    db = getDB();
    app.listen(5000, () => {
      console.log("server is listening to port 5000");
      log("Navigate through 👉 http://localhost:5000/ (Ctr + Click)");
    });
    let obj1=await db.collection('topics').find({},{projection:{_id:0,topic:1}}).toArray();
    topics= obj1.map(e=>e.topic);
    let obj2 = await db.collection('quiz').find().toArray();
    for(let e of obj2){
        let {c,...newObj}= e;
        quiz[e._id]=newObj;
    }
  }
  catch (err) {
    console.log("Failed to connect to DB", err);
  }
}

startServer();
