import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function diagnose() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-2.0-flash-exp",
    "gemini-pro",
  ];

  for (const modelName of modelsToTry) {
    console.log(`--- Testing model: ${modelName} ---`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      console.log(`✅ Success with ${modelName}: ${response.text().trim()}`);
      break; // Stop if we find one that works
    } catch (e: any) {
      console.log(`❌ Failed with ${modelName}: ${e.message}`);
    }
  }
}

diagnose();
