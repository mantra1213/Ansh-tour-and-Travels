
import { GoogleGenAI, Type } from "@google/genai";

export const getMumbaiExpertAdvice = async (userPrompt: string) => {
  // Use the API key directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: `You are the "ANSH Mumbai Expert", a helpful AI travel assistant for ANSH Tours & Travels. 
        You know everything about Mumbai, Badlapur, Navi Mumbai, and popular outstation routes like Shirdi, Pune, and Nashik.
        Your tone is professional and friendly.
        Provide advice on travel times, routes, and sightseeing.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a bit of trouble connecting to the Mumbai expert line. How can I help you manually?";
  }
};

export const generateItinerary = async (destination: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a one-day travel itinerary for ${destination} starting from Mumbai.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            proTip: { type: Type.STRING }
          },
          required: ["title", "schedule", "proTip"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Itinerary Error:", error);
    return null;
  }
};
