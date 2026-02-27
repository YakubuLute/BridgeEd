import { env } from "../../config/env";

export class GeminiService {
  private readonly apiKey: string;

  constructor(apiKey: string = env.GEMINI_API_KEY) {
    this.apiKey = apiKey;
  }

  async generateStructuredResponse(): Promise<never> {
    throw new Error(
      `Gemini service placeholder. API key loaded: ${this.apiKey.length > 0 ? "yes" : "no"}`
    );
  }
}
