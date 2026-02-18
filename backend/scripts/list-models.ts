import dotenv from "dotenv";
dotenv.config();

async function listAllModels() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  console.log(`Using API Key starting with: ${apiKey.substring(0, 10)}...`);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();
    console.log("Response from /v1beta/models:");
    console.log(JSON.stringify(data, null, 2));

    if (data.error) {
      console.log("Error detected in v1beta response, trying v1...");
      const respV1 = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      );
      const dataV1 = await respV1.json();
      console.log("Response from /v1/models:");
      console.log(JSON.stringify(dataV1, null, 2));
    }
  } catch (e: any) {
    console.error("Fetch failed:", e.message);
  }
}

listAllModels();
