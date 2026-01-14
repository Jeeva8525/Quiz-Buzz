import express from 'express';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import writeIntoQuiz from './utils/writer.js';
import { v4 } from 'uuid';
import { createQuizValidationSchema } from './utils/validationSchemas.js';
import { validationResult, matchedData, checkSchema } from 'express-validator';

import { log } from 'console'; //instead of console.log(), can also use log()

const __filePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filePath)

const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let quiz = {};
let choices ={};

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

app.get("/quiz/:quizID",(req,res)=>{
    return res.status(200).sendFile(path.resolve(__dirname,'./public/attemptQuiz/index.html'));
});

app.get("/quiz/:quizID/delete",(req,res)=>{
    return res.status(200).sendFile(path.resolve(__dirname,'./public/deleteQuiz/index.html'));
});





app.post("/api/quiz/create",
    checkSchema(createQuizValidationSchema),
    (req, res) => {
        const validResult = validationResult(req);
        if (!validResult.isEmpty())
        {
            return res.status(400).json({error: validResult.array()})
        }

        let newID
        do {
            newID = v4();
        } while (quiz[newID]);
        quiz[newID] = req.body;
        writeIntoQuiz(quiz);
        res.status(201).json({ success: true, msg: "New quiz created" })
    });



app.put("/api/quiz/:quizId", (req, res) => {
    let quizId = req.params.quizId;
    if (!quiz[quizId]) {
        return res.status(404).json({ success: false, msg: "No such quiz" })
    }
    let body = req.body;
    quiz[quizId] = { ...quiz[quizId], ...body };
    writeIntoQuiz(quiz);
    res.status(201).json({ success: true, msg: `quiz "${quiz[quizId]["name"]}" updated ` })
})

app.delete("/api/quiz/:quizId", (req, res) => {
    let quizId = req.params.quizId;
    if (!quiz[quizId]) {
        return res.status(404).json({ success: false, msg: "No such quiz" })
    }
    let quizName = quiz[quizId]["name"];
    delete quiz[quizId]
    writeIntoQuiz(quiz);
    res.status(201).json({ success: true, msg: `quiz "${quizName}" deleted ` })
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

app.get('/quiz/:quizID/submit/:submitID',(req,res)=>{
    return res.status(200).sendFile(path.resolve(__dirname,'./public/score/index.html'));
});

app.get('/createQuiz',(req,res) => {
    res.status(200).sendFile(path.resolve(__dirname,'./public/createQuiz/index.html'))
})

app.all('/*', (req, res) => {
    res.status(404).json({ success: false, msg: 'no such page exists' });
});

function startServer() {

    quiz = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'database/quiz.json'), 'utf-8'));
    app.listen(5000, () => {
        console.log("server is listening to port 5000");
        log("Navigate through 👉 http://localhost:5000/ (Ctr + Click)");
    });
};

startServer();

