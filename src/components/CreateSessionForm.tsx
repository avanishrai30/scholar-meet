
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, MapPin, Clock, Navigation } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import LocationInput from './LocationInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface CreateSessionFormProps {
  onSubmit: (formData: any) => void;
}

const CreateSessionForm: React.FC<CreateSessionFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [duration, setDuration] = useState("60");
  const [locationType, setLocationType] = useState("manual");
  const [manualLocation, setManualLocation] = useState("");
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);
  const [useLiveLocation, setUseLiveLocation] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(true);
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!subject || !topic || !date || !time || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate location based on type
    if (locationType === 'manual' && !manualLocation) {
      toast({
        title: "Location Required",
        description: "Please enter a location for the study session.",
        variant: "destructive"
      });
      return;
    }
    
    // Collect form data
    const formData = {
      subject,
      topic,
      date,
      time,
      duration: parseInt(duration),
      location: {
        type: locationType,
        value: manualLocation,
        coordinates: null,
        useLiveTracking: useLiveLocation
      },
      description,
      isPublic,
      sendNotifications
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select required value={subject} onValueChange={setSubject}>
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="cs">Computer Science</SelectItem>
              <SelectItem value="bio">Biology</SelectItem>
              <SelectItem value="chem">Chemistry</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          placeholder="E.g. Calculus II - Integration techniques"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date & Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Select required value={time} onValueChange={setTime}>
            <SelectTrigger id="time">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }).map((_, i) => (
                <SelectItem key={i} value={`${i}:00`}>
                  {i === 0 ? "12:00 AM" : i < 12 ? `${i}:00 AM` : i === 12 ? "12:00 PM" : `${i - 12}:00 PM`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Duration (minutes)
        </Label>
        <Select value={duration} onValueChange={setDuration}>
          <SelectTrigger id="duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1.5 hours</SelectItem>
            <SelectItem value="120">2 hours</SelectItem>
            <SelectItem value="180">3 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location
        </Label>
        
        <Tabs defaultValue="manual" onValueChange={setLocationType}>
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="googleMaps">Google Maps</TabsTrigger>
            <TabsTrigger value="liveLocation">Live Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual">
            <Input
              placeholder="E.g. Library, Room 203"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              required={locationType === "manual"}
            />
          </TabsContent>
          
          <TabsContent value="googleMaps">
            <div className="space-y-2">
              <div className="h-[150px] rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Google Maps will be displayed here</p>
              </div>
              <Input 
                placeholder="Search for location"
                className="mt-2"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="liveLocation">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="liveTracking" 
                  checked={useLiveLocation}
                  onCheckedChange={setUseLiveLocation}
                />
                <Label htmlFor="liveTracking">Enable live location tracking</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Your current location will be shared with participants during the session
              </p>
              <div className="h-[100px] rounded-md bg-muted/30 flex items-center justify-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Get My Location
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add details about what you want to study or what help you need"
          className="min-h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="public" 
            checked={isPublic} 
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public">Make session public</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="notifications" 
            checked={sendNotifications} 
            onCheckedChange={setSendNotifications}
            defaultChecked 
          />
          <Label htmlFor="notifications">Send notifications</Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit"
          className="campus-button bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
        >
          Create Study Session
        </Button>
      </div>
    </form>
  );
};

export default CreateSessionForm;
