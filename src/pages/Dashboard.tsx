
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import SearchBar from '@/components/SearchBar';
import SubjectCard from '@/components/SubjectCard';
import StudySessionCard from '@/components/StudySessionCard';
import AIAssistant from '@/components/AIAssistant';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Book, Code, Beaker, ChevronRight, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { StudyAssistantSidebar } from '@/components/StudyAssistantSidebar';
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Navigation } from 'lucide-react';

const sampleSubjects = [
  { id: 1, name: "Math", icon: <Calendar className="w-5 h-5 text-white" />, color: "bg-campus-blue" },
  { id: 2, name: "Physics", icon: <Clock className="w-5 h-5 text-white" />, color: "bg-campus-purple" },
  { id: 3, name: "Literature", icon: <Book className="w-5 h-5 text-white" />, color: "bg-campus-pink" },
  { id: 4, name: "Computer Science", icon: <Code className="w-5 h-5 text-white" />, color: "bg-campus-mint" },
  { id: 5, name: "Chemistry", icon: <Beaker className="w-5 h-5 text-white" />, color: "bg-campus-purple" },
];

const sampleSessions: StudySession[] = [
  {
    id: 1,
    subject: "Physics",
    topic: "Electromagnetism Study Group",
    location: "Tech Building, Room 203",
    time: "Today, 3:30 PM",
    participants: [
      { name: "Alex", avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Jamie", avatar: "https://i.pravatar.cc/150?img=2" },
      { name: "Taylor", avatar: "https://i.pravatar.cc/150?img=3" },
      { name: "Morgan", avatar: "https://i.pravatar.cc/150?img=4" },
    ],
    maxParticipants: 6,
    latitude: 37.7749,
    longitude: -122.4194
  },
  {
    id: 2,
    subject: "Computer Science",
    topic: "Algorithms Practice",
    location: "Library, West Wing",
    time: "Tomorrow, 2:00 PM",
    participants: [
      { name: "Jordan", avatar: "https://i.pravatar.cc/150?img=5" },
      { name: "Casey", avatar: "https://i.pravatar.cc/150?img=6" },
    ],
    maxParticipants: 5,
    latitude: 37.3352,
    longitude: -121.8811
  },
];

const filterSessionsByLocation = (sessions: StudySession[]) => {
  return sessions;
};

// StudySession interface moved to top-level
interface StudySession {
  id: number;
  subject: string;
  topic: string;
  location: string;
  time: string;
  participants: { name: string; avatar: string }[];
  maxParticipants: number;
  latitude?: number;
  longitude?: number;
}

// Single Dashboard component definition
export default function Dashboard() {
  const [sessions, setSessions] = useState<StudySession[]>(sampleSessions);
  const [subjects] = useState(sampleSubjects);
  const [search, setSearch] = useState("");
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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
  }, []);

  // Filter sessions by search and location (if needed)
  const filteredSessions = sessions.filter(session =>
    session.topic.toLowerCase().includes(search.toLowerCase()) ||
    session.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <NavBar />
      <div className="pt-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex gap-2 items-center">
              <SearchBar />
              <Button variant="outline" onClick={() => setShowAIAssistant(v => !v)}>
                AI Assistant
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {subjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject.name} icon={subject.icon} color={subject.color} />
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Study Sessions</h2>
              <Button size="sm" className="flex items-center gap-1" onClick={() => navigate('/create-session')}>
                <Plus className="w-4 h-4" /> New Session
              </Button>
            </div>
            <div className="grid gap-4">
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <StudySessionCard key={session.id} subject={session.subject} topic={session.topic} location={session.location} time={session.time} participants={session.participants} maxParticipants={session.maxParticipants} />
                ))
              ) : (
                <div className="text-muted-foreground">No sessions found.</div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-96 flex-shrink-0">
          {showAIAssistant ? <AIAssistant /> : <StudyAssistantSidebar />}
        </div>
      </div>
    </div>
  );
};

// LocationFilter moved to proper file scope
const LocationFilter = () => {
  // Filter component implementation
};

// Helper function remains in single declaration

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * 
    Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};
