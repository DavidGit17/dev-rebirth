import React, {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string) {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error(`${component} must be used within <Popover>`);
  }
  return context;
}

export interface PopoverProps {
  children?: React.ReactNode;
}

export function Popover({ children }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <PopoverContext.Provider value={value}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function PopoverTrigger({
  asChild,
  children,
  ...props
}: PopoverTriggerProps) {
  const context = usePopoverContext("PopoverTrigger");

  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement>
    >;
    return cloneElement(child, {
      ...props,
      onClick: (event: React.MouseEvent) => {
        child.props.onClick?.(event as React.MouseEvent<HTMLElement>);
        context.setOpen(!context.open);
      },
    });
  }

  return (
    <button
      type="button"
      {...props}
      onClick={() => context.setOpen(!context.open)}
    >
      {children}
    </button>
  );
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PopoverContent({
  className,
  children,
  ...props
}: PopoverContentProps) {
  const context = usePopoverContext("PopoverContent");
  if (!context.open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 w-72 rounded-none border border-border bg-card p-3 shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
