import dotenv from "dotenv";
import OpenAI from "openai";

// Load env variables here (ensures it's always ready)
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
