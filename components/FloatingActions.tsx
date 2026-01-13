import { Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionsProps {
  onAddClick: () => void;
  onActivitiesClick: () => void;
  hasActivities: boolean;
}

export function FloatingActions({ onAddClick, onActivitiesClick, hasActivities }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-30 px-6">
      <div className="flex items-center gap-3 max-w-md mx-auto">
        {hasActivities && (
          <Button
            onClick={onActivitiesClick}
            variant="secondary"
            className="h-14 px-5 rounded-2xl shadow-lg font-semibold shrink-0 transition-all active:scale-95"
          >
            <FolderOpen className="w-5 h-5 mr-2" />
            Activities
          </Button>
        )}
        
        <Button
          onClick={onAddClick}
          className="h-14 flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Activity
        </Button>
      </div>
    </div>
  );
}
