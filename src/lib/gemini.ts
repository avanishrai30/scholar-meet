import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) throw new Error('VITE_GEMINI_API_KEY is not defined');

const genAI = new GoogleGenerativeAI(apiKey);

export const generateResponse = async (prompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};