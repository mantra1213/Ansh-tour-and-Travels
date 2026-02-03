
import { GoogleGenAI, Type } from "@google/genai";

export const getMumbaiExpertAdvice = async (userPrompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: `You are the "ANSH Mumbai Expert", a helpful AI travel assistant for ANSH Tours & Travels. 
        You know everything about Mumbai, Badlapur, Navi Mumbai, and popular outstation routes like Shirdi, Pune, and Nashik.
        Your tone is premium, professional, and friendly.
        Provide advice on travel times, best routes to avoid traffic, estimated fares based on ₹12/km, and local sightseeing tips.
        Always promote ANSH services gracefully. Use Marathi or Hindi words occasionally if requested or appropriate for a local feel.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a bit of trouble connecting to the Mumbai expert line. How can I help you with your booking manually?";
  }
};

export const generateItinerary = async (destination: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a one-day travel itinerary for ${destination} starting from Mumbai with ANSH Tours & Travels. Include food stops and timing.`,
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
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    return null;
  }
};
