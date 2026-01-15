import { useState, useRef, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/lib/storage';

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedText: string) => void;
  activity: Activity | null;
  isSubmitting?: boolean;
}

export function EditActivityModal({ 
  isOpen, 
  onClose, 
  onSave, 
  activity,
  isSubmitting = false
}: EditActivityModalProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && activity) {
      setValue(activity.activity);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, activity]);

  const handleSave = () => {
    if (value.trim() && !isSubmitting) {
      onSave(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen || !activity) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40"
        onClick={isSubmitting ? undefined : onClose}
      />
      
      {/* Modal Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 slide-up">
        <div className="bg-surface-elevated rounded-t-3xl shadow-2xl border-t border-border/50">
          <div className="p-6">
            {/* Handle */}
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Edit Activity
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Input */}
            <div className="relative">
              <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                placeholder="What did you work on?"
                rows={3}
                className="w-full bg-muted rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50"
              />
            </div>
            
            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={!value.trim() || isSubmitting}
              className="w-full mt-4 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
          
          {/* Safe area for mobile */}
          <div className="h-safe-area-inset-bottom bg-surface-elevated" />
        </div>
      </div>
    </>
  );
}
