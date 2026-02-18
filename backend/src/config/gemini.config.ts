import dotenv from "dotenv";
dotenv.config();

export const geminiConfig = {
  apiKey: process.env.GEMINI_API_KEY || "",
  model: "gemini-2.0-flash",
  maxTokens: 1000,
};

if (!geminiConfig.apiKey) {
  console.warn("⚠️  GEMINI_API_KEY not found in environment variables");
}
