
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIRecommendation } from "@/types/ai";
import { supabase } from "@/integrations/supabase/client";

interface UseAIAssistantProps {
  initialPrompt?: string;
}

export const useAIAssistant = (props: UseAIAssistantProps = {}) => {
  const { initialPrompt = '' } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const generateRecommendations = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Using Supabase Edge Functions instead of direct API call
      const { data, error: funcError } = await supabase.functions.invoke("generate-recommendations", {
        body: { prompt: prompt || initialPrompt || "Recommend study topics for a college student" }
      });

      if (funcError) {
        throw new Error(`Error: ${funcError.message}`);
      }

      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        throw new Error('Invalid response format from AI service');
      }

      if (parsedData?.recommendations) {
        setRecommendations(parsedData.recommendations);
        return parsedData.recommendations;
      } else {
        // Fallback recommendations if API fails
        const fallbackRecs = [
          "Study effective note-taking techniques",
          "Practice active recall for better retention",
          "Try the Pomodoro technique for focused studying"
        ];
        setRecommendations(fallbackRecs);
        return fallbackRecs;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get AI recommendations";
      setError(errorMessage);
      console.error("AI Assistant Error:", errorMessage);
      
      toast({
        title: "AI Recommendation Error",
        description: "Using fallback recommendations. Please try again later.",
        variant: "destructive",
      });
      
      // Return fallback recommendations on error
      const fallbackRecs = [
        "Review core concepts from your textbook",
        "Form a study group with classmates",
        "Create visual diagrams of complex topics"
      ];
      setRecommendations(fallbackRecs);
      return fallbackRecs;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateRecommendations,
    recommendations,
    isLoading,
    error,
  };
};

export default useAIAssistant;
