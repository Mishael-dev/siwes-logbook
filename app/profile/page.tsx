"use client";

import { useState } from "react";
import { User, PenLine, Check, Activity, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Alex Johnson");
  
  // Mock data for progress
  const weeksDone = 12;
  const totalWeeks = 24;
  const progressPercentage = (weeksDone / totalWeeks) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Profile Card */}
        <div className="bg-surface-elevated bg-card rounded-2xl p-8 shadow-lg border border-border/50 flex flex-col items-center text-center space-y-6">
          
          {/* Avatar */}
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background ring-2 ring-primary/20">
              <User className="w-10 h-10 text-primary" />
            </div>
            {/* Optional: Camera icon overlay for avatar edit hint */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-white text-xs">Change</span>
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
              <div className="flex items-center justify-center gap-2 group">
                <h2 className="text-2xl font-serif text-foreground">{name}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-text-secondary hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                >
                  <PenLine className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-text-secondary mt-1">Software Engineering Intern</p>
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

        {/* Simple Logout Link (Optional UX) */}
        <button className="text-sm text-text-secondary hover:text-destructive transition-colors">
          Sign out
        </button>
      </div>
    </div>
  );
}