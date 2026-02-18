import React, {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext(component: string) {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error(`${component} must be used within <AlertDialog>`);
  }
  return context;
}

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function AlertDialog({
  open,
  onOpenChange,
  children,
}: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open ?? false);

  useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [open]);

  const setOpen = (next: boolean) => {
    if (onOpenChange) {
      onOpenChange(next);
    } else {
      setInternalOpen(next);
    }
  };

  const value = useMemo(
    () => ({ open: internalOpen, setOpen }),
    [internalOpen],
  );

  return (
    <AlertDialogContext.Provider value={value}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function AlertDialogTrigger({
  asChild,
  children,
  ...props
}: AlertDialogTriggerProps) {
  const context = useAlertDialogContext("AlertDialogTrigger");
  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement>
    >;
    return cloneElement(child, {
      ...props,
      onClick: (event: React.MouseEvent) => {
        child.props.onClick?.(event as React.MouseEvent<HTMLElement>);
        context.setOpen(true);
      },
    });
  }

  return (
    <button type="button" {...props} onClick={() => context.setOpen(true)}>
      {children}
    </button>
  );
}

export interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AlertDialogContent({
  className,
  children,
  ...props
}: AlertDialogContentProps) {
  const context = useAlertDialogContext("AlertDialogContent");
  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className={cn(
          "w-full max-w-md rounded-none border border-border bg-card p-4 shadow-lg",
          className,
        )}
        role="dialog"
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3 space-y-2", className)} {...props} />;
}

export function AlertDialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function AlertDialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}

export function AlertDialogCancel({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useAlertDialogContext("AlertDialogCancel");
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        context.setOpen(false);
      }}
      className={cn(
        "rounded-none border border-border bg-transparent px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function AlertDialogAction({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = useAlertDialogContext("AlertDialogAction");
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        context.setOpen(false);
      }}
      className={cn(
        "rounded-none bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
        className,
      )}
    >
      {children}
    </button>
  );
}
