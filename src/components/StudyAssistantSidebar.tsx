import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { OpenAIApiResponse } from '@/types';

export const StudyAssistantSidebar = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data: OpenAIApiResponse = await response.json();

      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
        toast({ title: 'AI Recommendations Generated' });
      } else {
        throw new Error(data.error || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      toast({
        title: 'AI Service Error',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 p-4 border-l h-full bg-background">
      <h3 className="text-lg font-semibold mb-4">Study Assistant</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-prompt">Learning Question</Label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask for study resources or clarification..."
            className="h-32"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? 'Generating...' : 'Get Recommendations'}
        </Button>
      </form>

      {recommendations.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-medium">Suggested Resources:</h4>
          <ul className="space-y-2 text-sm">
            {recommendations.map((rec, i) => (
              <li key={i} className="p-2 bg-muted/50 rounded-md">• {rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};