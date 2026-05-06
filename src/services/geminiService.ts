import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fetchWordDetails(kanji: string, reading: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請幫我查日文單字「${kanji}」(${reading}) 的意思、詞性以及提供三個日文例句與其中文翻譯。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meaning: {
              type: Type.STRING,
              description: "單字的中文意思，多個意思請用分號隔開",
            },
            type: {
              type: Type.STRING,
              description: "單字的詞性，例如 n., v., adj., adv., phr.",
            },
            examples: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: {
                    type: Type.STRING,
                    description: "日文例句",
                  },
                  translation: {
                    type: Type.STRING,
                    description: "例句的中文翻譯",
                  },
                },
                required: ["original", "translation"],
              },
            },
          },
          required: ["meaning", "type", "examples"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Error fetching word details from Gemini:", error);
    return null;
  }
}
