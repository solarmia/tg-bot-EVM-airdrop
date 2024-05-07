import dotenv from "dotenv";
import { connectMongoDB } from "./db";
dotenv.config();

export const botToken = process.env.TOKEN!
export const mongoUrl = process.env.MONGO_URL!

export const init = async () => {
    connectMongoDB()
}