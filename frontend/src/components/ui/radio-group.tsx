import { createContext, useContext, useMemo } from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  value?: string;
  setValue: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function RadioGroup({
  value,
  onValueChange,
  className,
  children,
}: RadioGroupProps) {
  const contextValue = useMemo(
    () => ({ value, setValue: (next: string) => onValueChange?.(next) }),
    [value, onValueChange],
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={cn("grid gap-2", className)}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioGroupItemProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  value: string;
}

export function RadioGroupItem({
  className,
  value,
  id,
  ...props
}: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext);

  const checked = context?.value === value;

  return (
    <input
      id={id}
      type="radio"
      value={value}
      checked={checked}
      onChange={() => context?.setValue(value)}
      className={cn(
        "h-4 w-4 shrink-0 rounded-full border border-border text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 accent-primary",
        className,
      )}
      {...props}
    />
  );
}
