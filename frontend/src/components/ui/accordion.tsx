import { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<string | null>(null);

function useAccordionContext(component: string) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(`${component} must be used within <Accordion>`);
  }
  return context;
}

function useAccordionItemValue(component: string) {
  const value = useContext(AccordionItemContext);
  if (!value) {
    throw new Error(`${component} must be used within <AccordionItem>`);
  }
  return value;
}

export interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  children?: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = 'single',
  collapsible = true,
  defaultValue,
  children,
  className
}: AccordionProps) {
  const initial = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
    ? [defaultValue]
    : [];
  const [openItems, setOpenItems] = useState<string[]>(initial);

  const toggleItem = (value: string) => {
    setOpenItems((current) => {
      const isOpen = current.includes(value);

      if (type === 'single') {
        if (isOpen && collapsible) return [];
        return [value];
      }

      if (isOpen) {
        return current.filter((item) => item !== value);
      }
      return [...current, value];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('divide-y divide-border', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn('border border-border', className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const context = useAccordionContext('AccordionTrigger');
  const value = useAccordionItemValue('AccordionTrigger');

  const isOpen = context.openItems.includes(value);

  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        context.toggleItem(value);
      }}
      className={cn(
        'flex w-full items-center justify-between bg-transparent px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-primary/5',
        isOpen && 'text-primary',
        className
      )}
    >
      <span>{children}</span>
      <span className="text-xs">{isOpen ? '−' : '+'}</span>
    </button>
  );
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const context = useAccordionContext('AccordionContent');
  const value = useAccordionItemValue('AccordionContent');

  const isOpen = context.openItems.includes(value);

  if (!isOpen) return null;

  return (
    <div className={cn('px-4 py-3 text-sm text-foreground', className)} {...props}>
      {children}
    </div>
  );
}
