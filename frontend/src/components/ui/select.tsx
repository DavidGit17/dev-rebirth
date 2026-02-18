import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value?: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(component: string) {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error(`${component} must be used within <Select>`);
  }
  return context;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function Select({
  value,
  onValueChange,
  className,
  children,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const setValue = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
  };

  const contextValue = useMemo(
    () => ({ value: internalValue, setValue, open, setOpen }),
    [internalValue, open],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className={cn("relative", className)}>{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useSelectContext("SelectTrigger");

  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex w-full items-center justify-between rounded-none border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
}

export function SelectContent({ className, children }: SelectContentProps) {
  const context = useSelectContext("SelectContent");
  if (!context.open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full border border-border bg-card shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface SelectItemProps {
  value: string;
  className?: string;
  children?: React.ReactNode;
}

export function SelectItem({ value, className, children }: SelectItemProps) {
  const context = useSelectContext("SelectItem");
  const isSelected = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.setValue(value)}
      className={cn(
        "flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-primary/10",
        isSelected && "bg-primary/20 text-primary",
        className,
      )}
    >
      {children ?? value}
    </button>
  );
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({
  placeholder = "Select an option",
  className,
}: SelectValueProps) {
  const context = useSelectContext("SelectValue");
  return (
    <span className={cn("flex-1 text-left text-sm text-foreground", className)}>
      {context.value || placeholder}
    </span>
  );
}
