
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { LogIn, Phone, Mail, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';
import LiveLocationMap from "@/components/LiveLocationMap";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authMethod, setAuthMethod] = useState<'email'>('email');
  const [step, setStep] = useState<'initial' | 'verify'>('initial');
  
  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Handle Phone Login with OTP
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format phone with + prefix if not already present
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone",
      });
      
      setStep('verify');
    } catch (error: any) {
      console.error('Phone login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format phone with + prefix if not already present
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { error, data } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success!",
        description: "You have successfully logged in",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Email Login/Signup
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // If login fails, try to sign up
        if (error.message.includes('Invalid login')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
            }
          });
          
          if (signUpError) throw signUpError;
          
          toast({
            title: "Account Created",
            description: "Please check your email to verify your account",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You have successfully logged in",
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Could not authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not login with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setStep('initial');
    setOtp('');
  };

  // Get user location effect
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [step]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="absolute inset-0 bg-campus-gradient opacity-5 -z-10" />
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Logo size="lg" />
          <h1 className="text-3xl font-display font-bold gradient-text mt-6">Welcome Back</h1>
          <p className="text-muted-foreground text-center">
            Sign in to access your study groups and personalized recommendations
          </p>
        </div>

        <Card className="w-full glass-card border-accent/20">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {step === 'initial' ? (
              <>
                <Tabs 
                  defaultValue={authMethod} 
                  className="w-full" 
                  onValueChange={() => {}} // No-op since only one method
                >
                  <TabsList className="grid w-full grid-cols-1 mb-4">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="email">
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Password
                        </label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-white" 
                        disabled={isSubmitting || !email || !password}
                      >
                        {isSubmitting ? "Authenticating..." : "Sign In / Sign Up"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleGoogleLogin}
                  className="w-full bg-background/50"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-medium">Verification Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to your phone {phone}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <InputOTP 
                    value={otp} 
                    onChange={(value) => setOtp(value)} 
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white" 
                    disabled={isSubmitting || otp.length !== 6}
                  >
                    {isSubmitting ? "Verifying..." : "Verify & Sign In"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-sm" 
                    onClick={handleBack}
                  >
                    Back to login
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-xs text-center text-muted-foreground mt-2">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="link" 
            className="text-sm text-muted-foreground" 
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

// Remove any duplicate useEffect and JSX code that is outside the AuthPage component at the bottom of the file
