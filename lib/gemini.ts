import { GoogleGenerativeAI } from "@google/generative-ai";


export const getGemini = () => {
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("Missing GOOGLE_API_KEY");
const genAI = new GoogleGenerativeAI(apiKey);
// Pick an up-to-date model; adjust as needed (e.g., 'gemini-1.5-flash', 'gemini-1.5-pro')
return genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
};