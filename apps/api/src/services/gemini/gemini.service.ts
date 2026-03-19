import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/env";
import { GeneratedScreenerResponseSchema, type GeneratedScreenerResponse } from "@bridgeed/shared";

export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor(apiKey: string = env.GEMINI_API_KEY) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateScreener(subject: string, gradeLevel: string): Promise<GeneratedScreenerResponse> {
    const prompt = `
      You are an expert curriculum developer. 
      Generate a rapid diagnostic screener assessment (5 questions) for ${gradeLevel} students focusing on ${subject}.
      The output must be a valid JSON object matching the following structure:
      {
        "title": "A descriptive title for the assessment",
        "description": "A short description of the diagnostic focus",
        "questions": [
          {
            "questionText": "The text of the question",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "The exact string of the correct option",
            "skillTag": "The specific micro-skill being tested"
          }
        ]
      }
      Do not include markdown blocks, just return the raw JSON string.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const responseText = response.text || "{}";
      const jsonStr = responseText.replace(/^```json/, "").replace(/```$/, "").trim();
      const rawData = JSON.parse(jsonStr);

      // Validate against our schema
      const validatedData = GeneratedScreenerResponseSchema.parse(rawData);
      return validatedData;
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      throw new Error(`Failed to generate screener: ${error.message}`);
    }
  }

  async generateStructuredResponse(): Promise<never> {
    throw new Error("Gemini service placeholder.");
  }
}
