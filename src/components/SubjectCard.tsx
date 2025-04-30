
import React from 'react';
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: string;
  icon: React.ReactNode;
  color: string;
  active?: boolean;
  onClick?: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  icon, 
  color, 
  active = false, 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "campus-card flex flex-col items-center gap-2 min-w-28 hover-scale cursor-pointer glass-card",
        active ? "ring-2 ring-primary" : ""
      )}
    >
      <div 
        className={cn(
          "w-12 h-12 flex items-center justify-center rounded-full", 
          color
        )}
      >
        {icon}
      </div>
      <span className="font-medium text-sm text-foreground">{subject}</span>
    </div>
  );
};

export default SubjectCard;
