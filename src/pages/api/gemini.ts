
// This is a placeholder for a server-side OpenAI API endpoint
// In a real application, this would be a server-side API or Supabase edge function

import { generateResponse as generateAIResponse } from '../../lib/gemini';

export const handleGeminiRequest = async (prompt: string) => {
  try {
    console.log("Processing prompt with Gemini:", prompt);
    return await generateAIResponse(prompt);
  } catch (error) {
    console.error("Error in Gemini API request:", error);
    throw error;
  }
};
