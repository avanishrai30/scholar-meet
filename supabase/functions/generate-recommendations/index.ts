
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured",
          recommendations: [
            "Set up OpenAI API key for personalized recommendations",
            "Study with spaced repetition techniques",
            "Create mind maps for complex subjects"
          ],
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Invalid prompt provided");
    }

    // Use system message to create an education-focused assistant
    const systemMessage = `You are a helpful AI study assistant for college students. 
      Provide short, practical study recommendations based on the prompt.
      Focus on effective study techniques, resource suggestions, and learning approaches.
      Return ONLY 3-5 brief bullet points - be concise and specific.`;
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    // Extract bullet points into an array
    // Split on any bullet point markers and filter out empty strings
    const recommendations = generatedText
      .split(/(?:\r\n|\r|\n|•|-)/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating recommendations:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        recommendations: [
          "Review your course materials regularly",
          "Use active recall techniques to improve retention",
          "Take breaks during study sessions to maintain focus"
        ],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});
