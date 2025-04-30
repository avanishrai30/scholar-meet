
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className, showText = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <div className={cn(
          "absolute inset-0 rounded-full bg-campus-gradient blur-md animate-pulse-glow",
          sizeClasses[size]
        )}></div>
        <div className={cn(
          "relative flex items-center justify-center bg-white dark:bg-campus-dark text-primary rounded-full aspect-square",
          sizeClasses[size]
        )}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-2/3 h-2/3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              className="fill-primary"
            />
            <path
              d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm3 7h-2v2h-2v-2H9v-2h2V9h2v2h2v2z"
              className="fill-primary"
            />
          </svg>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-foreground leading-tight">
            Campus<span className="text-primary">Circle</span>
          </span>
          <span className="text-xs text-muted-foreground">Study Smarter. Together.</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
