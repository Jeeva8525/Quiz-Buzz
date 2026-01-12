import express from 'express';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import writerIntoQuiz from './utils/writer.js';
import { log } from 'console'; //instead of console.log(), can also use log()

const __filePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filePath)

const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

let quiz = {};

app.get("/api/quiz/:quizID", (req, res) => {
    const { quizID } = req.params;
    if (!quiz[quizID]) {
        return res.status(404).json({ success: false, msg: 'no such quiz exists!' });
    }
    return res.status(200).json(quiz[quizID]);
});

app.get("/api/quiz", (req, res) => {
    // log(req.query)
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
            searchMatch = quiz[id].name.toLowerCase() === search.toLowerCase();
        }

        if (topicMatch && searchMatch) {
            filtered_quiz[id] = quiz[id];
        }
    }
    return res.status(200).json(filtered_quiz);

});

app.post("/api/quiz/create",(req,res)=>{
      
});

app.all('/*', (req, res) => {
    res.status(404).json({ success: 'false', msg: 'no such page exists' });
});

function startServer() {

    quiz = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'database/quiz.json'), 'utf-8'));
    app.listen(5000, () => {
        console.log("server is listening to port 5000");
    });
};

startServer();

