"use client";

import { useState } from "react";
import { 
  User, 
  PenLine, 
  Check, 
  Activity, 
  CalendarDays, 
  ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Alex Johnson");
  
  // Mock data for progress
  const weeksDone = 12;
  const totalWeeks = 24;
  const progressPercentage = (weeksDone / totalWeeks) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10 mt-8">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Top Navigation: Back Button */}
        <div className="w-full flex justify-start">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="-ml-2 text-text-secondary hover:text-foreground rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-surface-elevated bg-card rounded-2xl p-8 flex flex-col items-center  text-center space-y-6 ">
          
          {/* Avatar */}
          <div className="relative cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background ring-2 ring-primary/20">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 border-2 border-background shadow-sm">
                <PenLine className="w-3 h-3" />
            </div>
          </div>

          {/* Editable Name */}
          <div className="w-full">
            {isEditing ? (
              <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 h-10 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-center"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="h-10 w-10 text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-serif text-foreground">{name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-text-secondary/50 hover:text-primary transition-colors p-2"
                  aria-label="Edit name"
                >
                  <PenLine className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-text-secondary mt-1">Intern</p>
          </div>

          {/* Progress Section */}
          <div className="w-full space-y-3 bg-secondary/30 p-4 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-text-secondary">
                <CalendarDays className="w-4 h-4" />
                Internship Duration
              </span>
              <span className="font-medium text-foreground">
                {weeksDone} / {totalWeeks} Weeks
              </span>
            </div>
            
            {/* Custom Progress Bar */}
            <div className="h-2.5 w-full bg-background rounded-full overflow-hidden border border-border/50">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary text-right">
              {Math.round(progressPercentage)}% completed
            </p>
          </div>

          {/* View Activity Button */}
          <Button 
            className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 mt-2"
          >
            <Activity className="w-4 h-4" />
            View Activity
          </Button>

        </div>

        {/* Simple Logout Link */}
        <button className="text-sm text-text-secondary hover:text-destructive transition-colors pb-4">
          Sign out
        </button>
      </div>
    </div>
  );
}