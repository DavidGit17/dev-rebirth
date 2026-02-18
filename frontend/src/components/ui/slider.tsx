import { cn } from "@/lib/utils";

export interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: SliderProps) {
  const current = value[0] ?? 0;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(event) => onValueChange?.([Number(event.target.value)])}
      className={cn(
        "h-2 w-full appearance-none rounded-none bg-muted/40 accent-primary outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
    />
  );
}
