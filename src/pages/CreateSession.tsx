
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import NavBar from '@/components/NavBar';
import CreateSessionForm from '@/components/CreateSessionForm';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

// Import types
import { study_sessions } from '@/types/supabase';

// Define form data type
interface SessionFormData {
  subject: string;
  topic: string;
  date: Date;
  time: string;
  duration: string;
  location: {
    type: string;
    value: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    useLiveTracking: boolean;
  };
  description?: string;
  isPublic: boolean;
  sendNotifications: boolean;
}

const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: SessionFormData) => {
    setLoading(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.id) {
        throw new Error('Unable to retrieve user information');
      }

      const userId = userData.user.id;

      // Combine date and time into ISO format
      let start_time = new Date().toISOString();
      if (formData.date && formData.time) {
        const [hours, minutes] = formData.time.split(":");
        const dateObj = new Date(formData.date);
        dateObj.setHours(Number(hours));
        dateObj.setMinutes(Number(minutes));
        start_time = dateObj.toISOString();
      }

      // Prepare session data
      // Use generated type for session data
      const sessionData: study_sessions = {
        user_id: userId,
        start_time,
        expires_at: new Date(new Date(start_time).getTime() + Number(formData.duration) * 60000).toISOString(),
        location_text: formData.location.value || '',
        latitude: formData.location.coordinates?.latitude ?? null,
        longitude: formData.location.coordinates?.longitude ?? null,
        subject: formData.subject,
        topic: formData.topic,
        description: formData.description || '',
        duration: Number(formData.duration),
        is_public: Boolean(formData.isPublic),
        status: 'scheduled',
        max_participants: 10,
        created_at: new Date().toISOString()
      };

      // Update insert with proper typing
      // Attempt to insert the session with error handling
      const { data: insertedSession, error: insertError } = await supabase
        .from('study_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          throw new Error('A session with similar details already exists');
        } else if (insertError.code === '23503') { // Foreign key violation
          throw new Error('Invalid reference data in the session');
        } else if (insertError.code === '23502') { // Not null violation
          throw new Error('Missing required session information');
        }
        throw new Error(`Failed to create session: ${insertError.message}`);
      }

      if (!insertedSession) {
        throw new Error('Session was not created successfully');
      }

      toast({
        title: "Success!",
        description: `Study session "${formData.topic}" has been created for ${format(new Date(start_time), 'PPP')}.`,
        variant: "default"
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: "Session Creation Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="pt-24 px-4 md:px-6 lg:px-8 max-w-2xl mx-auto pb-20">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="pl-0 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h1 className="text-2xl font-display font-bold mb-6">Create a Study Session</h1>
          <CreateSessionForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateSession;
