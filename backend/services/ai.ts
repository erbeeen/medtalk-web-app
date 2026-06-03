import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export interface GeneratedMedicineInfo {
  usage: string;
  sideEffects: string;
  warnings: string;
}

export default async function generateMedicineInfo(
  medicine: string,
): Promise<[GeneratedMedicineInfo | null, Error | null]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a medical information assistant. Provide accurate and concise information about medications.
              Format your response as a JSON object with exactly these keys:
              - usage: Detailed usage instructions
              - sideEffects: List of common and serious side effects
              - warnings: Important warnings and precautions
              Keep each section concise but informative.
              Example format:
              {
                "usage": "Take 1 tablet daily with food",
                "sideEffects": "Common: nausea, headache. Serious: allergic reactions",
                "warnings": "Do not take if allergic to ingredients"
              }

                Provide information about ${medicine}. Format the response as JSON with usage, sideEffects, and warnings keys.`,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MEDIUM,
        },
      },
    });

    const description = response.text;
    const medicineInfo = await JSON.parse(description) as GeneratedMedicineInfo;
    return [medicineInfo, null];
  } catch (err) {
    return [null, err];
  }
}
