import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClass =
    variant === "outline"
      ? "border border-border text-foreground"
      : "bg-primary text-primary-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none px-2 py-1 text-xs font-semibold uppercase tracking-wide",
        variantClass,
        className,
      )}
      {...props}
    />
  );
}
