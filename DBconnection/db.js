import { MongoClient } from "mongodb";

let dbConnection;

export async function connectToDb() {
    const client = new MongoClient("mongodb+srv://vishveshwaran:135off120@blue-cluster.f1emu6s.mongodb.net/?appName=Blue-Cluster");
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
