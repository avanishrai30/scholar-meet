
import React from 'react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { LogIn, Globe } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const WelcomeHero: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      // Make sure Supabase's redirect URL matches our application URL
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: `Error: ${error.message}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error details:', error);
      toast({
        title: "Login failed",
        description: "Please check Supabase configuration and try again",
        variant: "destructive"
      });
    }
  };

  const handleGuestAccess = () => {
    // Navigate to dashboard as guest
    navigate('/dashboard');
    toast({
      title: "Welcome, Guest!",
      description: "You're exploring in guest mode",
    });
  };

  const navigateToAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6 animate-fade-in">
      <div className="absolute inset-0 bg-campus-gradient opacity-10 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-background to-background -z-10" />

      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary opacity-20 blur-3xl animate-pulse-glow" />
        <Logo size="lg" className="animate-float" />
      </div>
      
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-5xl font-display font-bold text-foreground">
          Study <span className="gradient-text">Smarter.</span> <span className="text-blue-500">Together.</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Find study partners, organize meetups, and collaborate with fellow students instantly on campus.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button 
          onClick={navigateToAuth}
          className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl py-6 px-8 shadow-xl hover:shadow-violet-500/30 transition-all duration-300 flex-1 text-lg font-medium"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity backdrop-blur-sm" />
          <LogIn className="mr-2 h-5 w-5" />
          Sign In
        </Button>
        <Button 
          onClick={handleGuestAccess}
          className="relative overflow-hidden border-2 border-slate-700 bg-slate-800 text-white rounded-xl py-6 px-8 shadow-lg hover:shadow-slate-800/30 transition-all duration-300 flex-1 text-lg font-medium"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-10 transition-opacity" />
          <Globe className="mr-2 h-5 w-5" />
          Explore as Guest
        </Button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        Powered by AI matching • Real-time study groups • Campus locations
      </div>
    </div>
  );
};

export default WelcomeHero;
