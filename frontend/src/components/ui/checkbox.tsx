import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "checked"
> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { className, checked = false, onCheckedChange, ...props },
    ref,
  ) {
    return (
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
        className={cn(
          "h-4 w-4 shrink-0 rounded-none border border-border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 accent-primary",
          className,
        )}
        {...props}
      />
    );
  },
);
