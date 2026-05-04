import "server-only";
import { GoogleGenAI } from "@google/genai";

// O @google/genai é o novo SDK (substituto do @google/generative-ai)
const apiKey = process.env.GEMINI_API_KEY;

let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({ apiKey });
}

const MODELO_PADRAO = "gemini-3.1-flash-lite-preview";

export async function gerarComponenteHTML(prompt: string, modelo?: string): Promise<string> {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY não está configurada no .env.local");
  }

  const modeloFinal = modelo || MODELO_PADRAO;

  const resposta = await genAI.models.generateContent({
    model: modeloFinal,
    contents: prompt,
    config: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  });

  const texto = resposta.text;
  if (!texto) throw new Error("Resposta vazia da Gemini.");

  return texto
    .replace(/^```html\s*/i, "")
    .replace(/^```tsx?\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

