
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface LocationInputProps {
  onLocationSelect: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationSelect }) => {
  const [location, setLocation] = useState("");
  
  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    onLocationSelect(e.target.value);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setLocation(locationString);
        onLocationSelect(locationString);
      }, (error) => {
        console.error("Error getting location:", error);
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input 
          value={location}
          onChange={handleManualInput}
          placeholder="Enter location manually"
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleGetCurrentLocation} 
          className="flex gap-1"
        >
          <Navigation className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline">Current</span>
        </Button>
      </div>
    </div>
  );
};

export default LocationInput;
