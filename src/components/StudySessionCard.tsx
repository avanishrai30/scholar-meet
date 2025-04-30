
import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StudySessionCardProps {
  subject: string;
  topic: string;
  location: string;
  time: string;
  participants: { name: string; avatar: string }[];
  maxParticipants: number;
}

const StudySessionCard: React.FC<StudySessionCardProps> = ({
  subject,
  topic,
  location,
  time,
  participants,
  maxParticipants
}) => {
  return (
    <div className="campus-card glass-card">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Badge variant="outline" className="bg-accent text-accent-foreground">
            {subject}
          </Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="w-4 h-4" />
            {participants.length}/{maxParticipants}
          </span>
        </div>
        
        <h3 className="font-display font-bold text-lg">{topic}</h3>
        
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((participant, i) => (
              <Avatar key={i} className="border-2 border-background w-8 h-8">
                <img src={participant.avatar} alt={participant.name} />
              </Avatar>
            ))}
            {participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                +{participants.length - 3}
              </div>
            )}
          </div>
          <Button className="campus-button bg-primary text-primary-foreground">
            I'm In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudySessionCard;
