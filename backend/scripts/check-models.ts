import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    console.log("Model initialized successfully with gemini-1.5-flash-latest");
  } catch (e) {
    console.error("Failed to initialize model:", e);
  }
}

listModels();
