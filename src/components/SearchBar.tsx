
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input 
        type="text" 
        placeholder="Search by subject, room, or topic" 
        className="pl-10 pr-4 py-2 rounded-full bg-secondary/50 border-none focus-visible:ring-2 focus-visible:ring-primary"
      />
    </div>
  );
};

export default SearchBar;
