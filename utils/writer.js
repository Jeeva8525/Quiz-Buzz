
import {writeFileSync} from 'fs'

export default function writeIntoQuiz(updatedQuiz){
       writeFileSync('./database/quiz.json',JSON.stringify(updatedQuiz,null,2));
}