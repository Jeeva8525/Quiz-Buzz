import { MongoClient } from "mongodb";

let dbConnection;

export async function connectToDb() {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    dbConnection = client.db("quizard");
    console.log("Connected to MongoDB");
}

export function getDB(){
  if (!dbConnection) {
    throw new Error("Database not connected yet!");
  }
  return dbConnection;
}
