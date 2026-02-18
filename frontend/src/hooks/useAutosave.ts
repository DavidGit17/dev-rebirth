import { useEffect, useRef, useState } from "react";

export function useAutosave<T>(
  data: T,
  onSave: (data: T) => void,
  delay: number = 1000,
) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<T>(data);

  useEffect(() => {
    if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    setStatus("saving");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSave(data);
      setStatus("saved");
      previousDataRef.current = data;

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay]);

  return status;
}
