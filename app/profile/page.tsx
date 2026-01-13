"use client";

import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  User, 
  PenLine, 
  Check, 
  Activity, 
  CalendarDays, 
  ChevronLeft,
  LogOut,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserName } from "@/app/actions/profile"; 

export default function ProfilePage() {
  const router = useRouter();
  
  // State for data
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [userImage, setUserImage] = useState<string | null>(null); 
  const [weeksDone, setWeeksDone] = useState(0);
  
  const totalWeeks = 24; 
  const progressPercentage = (weeksDone / totalWeeks) * 100;

  
  useEffect(() => {
    async function loadProfile() {
      const data = await getUserProfile();
      if (data) {
        setName(data.name);
        setWeeksDone(data.weeksDone);
        setUserImage(data.image); // Save the image URL
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  // 2. Handle Name Update
  const handleNameSave = async () => {
    setIsEditing(false); 
    await updateUserName(name); 
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-6 py-10 mt-8">
      <div className="w-full max-w-sm space-y-6">
        
        <div className="w-full flex justify-start">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/')}
            className="-ml-2 text-text-secondary hover:text-foreground rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-surface-elevated bg-card rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
          
          {/* Avatar Section (Updated) */}
          <div className="relative cursor-pointer">
            {userImage ? (
              <img 
                src={userImage} 
                alt="Profile"
                referrerPolicy="no-referrer" 
                className="w-24 h-24 rounded-full object-cover border-2 border-background ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background ring-2 ring-primary/20">
                <User className="w-10 h-10 text-primary" />
              </div>
            )}
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
                  onClick={handleNameSave}
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
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary text-right">
              {Math.round(progressPercentage)}% completed
            </p>
          </div>

          {/* View Activity Button */}
          <Button 
            onClick={() => router.push('/')}
            className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 mt-2"
          >
            <Activity className="w-4 h-4" />
            View Activity
          </Button>

        </div>
        
        {/* Sign Out Button */}
        <Button
          onClick={() => signOut({ redirectTo: "/" })}
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-text-secondary hover:text-destructive w-full"
        >
          <LogOut className="w-4 h-4 mr-1.5" />
          Sign out
        </Button>
      </div>
    </div>
  );
}