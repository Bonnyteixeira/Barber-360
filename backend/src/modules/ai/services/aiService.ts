import { GoogleGenAI } from '@google/genai';

export class AiService {
  static async completeChat(personality: string, customRules: string, history: any[]) {
    // Connection to GoogleGenAI SDK (Gemini) can go here
    return `Simulado para personalidade: ${personality}`;
  }
}
