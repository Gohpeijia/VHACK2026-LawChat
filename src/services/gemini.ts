import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const explainDocument = async (base64Image: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `You are LawChat, an expert NLP assistant for public services.
            1. Read this document (government letter, policy, or form).
            2. Simplify the content to a 5th-grade reading level (Lexical Simplification). Replace all legal/medical jargon with everyday words.
            3. Summarize the document into exactly 3-5 actionable bullet points (Recursive Summarization).
            4. Translate the explanation and summary into the target language: ${language}. 
               Note: If the language is a dialect (e.g., Kelantan, Sarawak), use the specific regional nuances.
            5. Cross-Lingual Retrieval: Ensure the answer is sourced accurately from the national-language document provided in the image.
            
            Respond in JSON format with the following structure:
            {
              "detectedLanguage": "string",
              "explanation": "string (markdown, simplified)",
              "actionGuide": ["step 1", "step 2", "step 3", "step 4", "step 5"],
              "replyDraft": "string (markdown, in target language)"
            }`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });

  const response = await model;
  return JSON.parse(response.text || '{}');
};

export const askLaw = async (query: string, simpleMode: boolean = false, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: query,
    config: {
      systemInstruction: `You are LawChat, a legal expert assistant. 
      - Grounding: Source all answers from official national statutes and government documents. 
      - Accuracy: Do not hallucinate. If unsure, say "I cannot find official information on this."
      - Dialect-Aware: You must handle queries in local dialects (e.g., Kelantan, Sarawak, Tagalog dialects, Indonesian regional dialects).
      - Simplification: ${simpleMode ? "Explain at a 5th-grade reading level. Use very simple words." : "Use clear, accessible language."}
      - Summarization: Always provide a summary of 3-5 actionable bullet points at the end of your response.
      - Language: Respond in the language/dialect requested: ${language}. 
      - Cross-Lingual: Even if the query is in a dialect, retrieve information from national-language official sources.`,
    },
  });

  const response = await model;
  return response.text;
};

export const analyzeContract = async (base64Image: string, language: string = 'en') => {
  const model = ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `Analyze this contract.
            - Flag any unfair or illegal clauses under national law.
            - Simplify the legal jargon to a 5th-grade level.
            - Provide a summary of the user's rights in 3-5 bullet points.
            - Respond in the target language: ${language}.
            
            Respond in JSON format:
            {
              "flags": [{"clause": "string", "reason": "string", "isIllegal": boolean}],
              "rightsSummary": "string (markdown summary, simplified, 3-5 bullet points)"
            }`,
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });

  const response = await model;
  return JSON.parse(response.text || '{}');
};
