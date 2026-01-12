import { formatDayName, formatFullDate, getCurrentWeekNumber, getCurrentYear } from '@/lib/storage';

interface DayHeaderProps {
  date?: Date;
}

export function DayHeader({ date = new Date() }: DayHeaderProps) {
  const dayName = formatDayName(date);
  const fullDate = formatFullDate(date);
  const weekNumber = getCurrentWeekNumber(date);
  const year = getCurrentYear(date);

  return (
    <header className="pt-8 pb-6 px-6">
      <p className="text-text-secondary text-sm font-medium mb-1">
        Week {weekNumber} • {year}
      </p>
      <h1 className="text-3xl font-serif text-foreground mb-1">
        {dayName}
      </h1>
      <p className="text-text-secondary text-base">
        {fullDate}
      </p>
    </header>
  );
}
