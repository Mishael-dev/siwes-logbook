import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddActivityInputProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: string) => void;
}

export function AddActivityInput({ isOpen, onClose, onSubmit }: AddActivityInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Input Panel */}
      <div className="fixed bottom-0 left-0 right-0 z-50 slide-up">
        <div className="bg-surface-elevated rounded-t-3xl shadow-2xl border-t border-border/50">
          <div className="p-6">
            {/* Handle */}
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Add Activity
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
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
                placeholder="What did you work on?"
                rows={3}
                className="w-full bg-muted rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            
            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="w-full mt-4 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
            >
              <Send className="w-4 h-4 mr-2" />
              Save Activity
            </Button>
          </div>
          
          {/* Safe area for mobile */}
          <div className="h-safe-area-inset-bottom bg-surface-elevated" />
        </div>
      </div>
    </>
  );
}
