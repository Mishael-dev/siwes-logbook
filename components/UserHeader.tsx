"use client";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function UserHeader(){
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.image;
  
  return (
   <div className="px-6 py-3 border-t border-border/30 flex items-center justify-between bg-muted/30">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <Link href="/profile">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full"
          />
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        )}
        <span className="text-sm font-medium text-foreground">{displayName}</span>
      </div>

      
      <Button
      type="submit"
      onClick={() => signOut({ redirectTo: "/" })}
        variant="ghost"
        size="sm"
        className="h-8 px-3 text-text-secondary hover:text-destructive"
      >
        <LogOut className="w-4 h-4 mr-1.5" />
        Sign out
      </Button>
    </div>
  );
}