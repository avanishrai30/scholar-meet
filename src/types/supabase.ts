export interface study_sessions {
  id?: string;
  user_id: string;
  start_time: string;
  expires_at: string;
  location_text: string;
  latitude: number | null;
  longitude: number | null;
  subject: string;
  topic: string;
  description: string;
  duration: number;
  is_public: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  max_participants: number;
  created_at: string;
  updated_at?: string;
}