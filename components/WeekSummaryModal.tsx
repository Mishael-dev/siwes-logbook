import { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Sparkles, Loader2, AlertCircle, FileText, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateWeekSummary, type SummaryResponse } from '@/app/actions/summary';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown'; 
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; 

interface WeekSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekNumber: number;
  year: number;
}

type Tab = 'report' | 'prompt';

export function WeekSummaryModal({ isOpen, onClose, weekNumber, year }: WeekSummaryModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('report');
  
  // Data States
  const [fullData, setFullData] = useState<SummaryResponse | null>(null);
  const [displayedContent, setDisplayedContent] = useState(''); // For typing effect
  
  // UI States
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const today = new Date();
    const lastGenTime = localStorage.getItem('last_generation_time');
    const now = Date.now();
    if (lastGenTime && now - parseInt(lastGenTime) < 60000) {
      const remaining = Math.ceil((60000 - (now - parseInt(lastGenTime))) / 1000);
      toast.warning(`Please wait ${remaining}s before regenerating.`);
      onClose();
      return;
    }

    
    const todayStr = format(today, 'yyyy-MM-dd');
    const storedDate = localStorage.getItem('generation_date');
    const storedCount = parseInt(localStorage.getItem('generation_count') || '0');
    let currentCount = (storedDate === todayStr) ? storedCount : 0;

    if (currentCount >= 3) {
      toast.error("Daily limit reached! (3/3 used)");
      onClose();
      return;
    }

    // --- START FETCH ---
    localStorage.setItem('last_generation_time', now.toString());
    localStorage.setItem('generation_date', todayStr);
    localStorage.setItem('generation_count', (currentCount + 1).toString());

    setIsLoading(true);
    setFullData(null);
    setDisplayedContent('');
    setError(null);
    setActiveTab('report'); 

    generateWeekSummary(weekNumber, year)
      .then((data) => {
        setFullData(data);
        setIsLoading(false);
        if (data.content) {
          setIsTyping(true); 
        } else {
          
          setActiveTab('prompt');
        }
      })
      .catch(() => {
        setError("Network error occurred.");
        setIsLoading(false);
      });

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, [isOpen, weekNumber, year, onClose]);

  useEffect(() => {
    if (isTyping && fullData?.content && activeTab === 'report') {
      let currentIndex = 0;
      const content = fullData.content;
      typingIntervalRef.current = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.slice(0, currentIndex + 5)); 
        } else {
          setDisplayedContent(content);
          setIsTyping(false);
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        }
      }, 10);
    } else if (activeTab === 'prompt') {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setIsTyping(false);
      if (fullData?.content) setDisplayedContent(fullData.content);
    }
  }, [isTyping, fullData, activeTab]);

  const handleCopy = async () => {
    try {
      const textToCopy = activeTab === 'report' ? (fullData?.content || "") : (fullData?.prompt || "");
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success(activeTab === 'report' ? 'Report copied!' : 'Prompt copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40" onClick={onClose} />
      
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto fade-in">
        <div className="bg-surface-elevated rounded-3xl shadow-2xl border border-border/50 overflow-hidden bg-white dark:bg-zinc-900 flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="p-6 pb-4 border-b border-border/50 shrink-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Week {weekNumber} Report</h2>
                  <p className="text-sm text-muted-foreground">AI Generator</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* TABS SWITCHER */}
            <div className="flex p-1 bg-muted rounded-xl">
              <button
                onClick={() => setActiveTab('report')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === 'report' 
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="w-4 h-4" />
                Result
              </button>
              <button
                onClick={() => setActiveTab('prompt')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all",
                  activeTab === 'prompt' 
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Terminal className="w-4 h-4" />
                Prompt
              </button>
            </div>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 min-h-[200px]">
            <div className="bg-muted/30 rounded-xl p-4 min-h-full relative">
              
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-red-500 gap-2 h-full">
                  <AlertCircle className="w-6 h-6" />
                  <span className="text-sm text-center">{error}</span>
                </div>
              ) : (
                <>
                  {/* TAB 1: RESULT */}
                  {activeTab === 'report' && (
                    <article className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
                      {fullData?.content ? (
                        <>
                          <ReactMarkdown>{displayedContent}</ReactMarkdown>
                          {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse align-middle" />}
                        </>
                      ) : (
                        <p className="text-muted-foreground italic">No result generated yet. Check the prompt tab.</p>
                      )}
                    </article>
                  )}

                  {/* TAB 2: PROMPT */}
                  {activeTab === 'prompt' && (
                    <div className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                      {fullData?.prompt}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 pt-2 border-t border-border/50 bg-muted/10 shrink-0">
            <Button
              onClick={handleCopy}
              disabled={isLoading || (activeTab === 'report' && !fullData?.content)}
              className="w-full h-11 rounded-xl font-medium transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy {activeTab === 'report' ? 'Report' : 'Prompt'}
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}