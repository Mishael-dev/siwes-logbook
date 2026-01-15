import { useState } from 'react';
import { X, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
  generatedText: string;
  isGenerating: boolean;
  title: string;
}

export function SummaryModal({ 
  isOpen, 
  onClose, 
  onGenerate,
  generatedText,
  isGenerating,
  title
}: SummaryModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal Panel */}
      <div className="fixed inset-4 z-50 flex items-center justify-center">
        <div className="bg-surface-elevated rounded-3xl shadow-2xl border border-border/50 w-full max-w-2xl max-h-[80vh] flex flex-col">
          <div className="p-6 border-b border-border/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-foreground">
                {title}
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
            <p className="text-sm text-muted-foreground">
              Generate a professional summary for your logbook
            </p>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!generatedText && !isGenerating && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground mb-6">
                  Click the button below to generate an AI-powered summary
                </p>
                <Button
                  onClick={onGenerate}
                  className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generating summary...</p>
              </div>
            )}

            {generatedText && !isGenerating && (
              <div className="space-y-4">
                <div className="bg-muted rounded-xl p-4">
                  <div 
                    className="prose prose-sm max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: generatedText.replace(/\n/g, '<br/>') 
                    }}
                  />
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="w-full h-10 rounded-xl"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
