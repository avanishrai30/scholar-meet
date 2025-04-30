
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Brain, Loader2 } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';

const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { generateRecommendations, isLoading, error } = useAIAssistant();
  
  useEffect(() => {
    // Generate initial recommendations when component mounts
    generateRecommendations("Suggest 3 study topics for a college student").then(recs => {
      if (recs && recs.length) {
        setSuggestions(recs);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const recs = await generateRecommendations(query);
    if (recs && recs.length) {
      setSuggestions(recs);
      setQuery("");
    }
  };

  return (
    <Card className="glass-card border border-accent/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Study Assistant
        </CardTitle>
        <CardDescription>AI-powered study recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-secondary/50 rounded-lg p-3 text-sm">
            <p className="font-medium">Based on your interests:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Getting recommendations...</span>
                </div>
              ) : error ? (
                <li>Could not load recommendations</li>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))
              ) : (
                <li>Ask the AI for study recommendations</li>
              )}
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs justify-start"
              onClick={() => generateRecommendations("Generate 3 flashcard topics for current college courses")}
              disabled={isLoading}
            >
              <Brain className="mr-1 h-3 w-3" /> Generate flashcards
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs justify-start"
              onClick={() => generateRecommendations("Create a 1-week study plan for finals")}
              disabled={isLoading}
            >
              <MessageCircle className="mr-1 h-3 w-3" /> Create study plan
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input 
            placeholder="Ask a study question..." 
            className="text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-primary text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageCircle className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
