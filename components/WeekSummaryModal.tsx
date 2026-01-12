import { useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateWeekSummaryPrompt, getWeekEntry } from '@/lib/storage';
import { toast } from 'sonner';

interface WeekSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekNumber: number;
  year: number;
}

export function WeekSummaryModal({ isOpen, onClose, weekNumber, year }: WeekSummaryModalProps) {
  const [copied, setCopied] = useState(false);
  const weekEntry = getWeekEntry(weekNumber, year);
  const summaryPrompt = generateWeekSummaryPrompt(weekNumber, year);
  
  const totalActivities = weekEntry?.entries.length || 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryPrompt);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto fade-in">
        <div className="bg-surface-elevated rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-foreground">
                    Week {weekNumber} Summary
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {totalActivities} activit{totalActivities !== 1 ? 'ies' : 'y'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full -mt-1 -mr-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 pb-4">
            <div className="bg-muted rounded-xl p-4 max-h-64 overflow-y-auto scrollbar-hide">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {summaryPrompt}
              </pre>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="px-6 pb-4">
            <p className="text-sm text-text-secondary text-center">
              Copy this prompt and paste it into ChatGPT, Claude, or any AI assistant to generate your weekly summary report.
            </p>
          </div>
          
          {/* Actions */}
          <div className="p-6 pt-2">
            <Button
              onClick={handleCopy}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
