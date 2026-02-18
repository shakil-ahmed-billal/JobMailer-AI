import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function testV2() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  console.log("Testing gemini-2.0-flash...");
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Respond with 'READY'");
    const response = await result.response;
    console.log(`✅ Success: ${response.text().trim()}`);
  } catch (e: any) {
    console.error(`❌ Failed: ${e.message}`);
  }
}

testV2();
