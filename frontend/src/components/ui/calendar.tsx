import { cn } from "@/lib/utils";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  mode?: "single";
  initialFocus?: boolean;
}

function formatDateValue(date?: Date) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  return (
    <input
      type="date"
      value={formatDateValue(selected)}
      onChange={(event) => {
        const value = event.target.value;
        onSelect?.(value ? new Date(value) : undefined);
      }}
      className={cn(
        "w-full rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
    />
  );
}
