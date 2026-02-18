import { useState, useEffect } from 'react';
import { storage } from './storage';

export function useAppState() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [startDate, setStartDateState] = useState<string | null>(null);
  const [devPath, setDevPathState] = useState<string | null>(null);

  useEffect(() => {
    const initialized = storage.getInitialized();
    const savedStartDate = storage.getStartDate();
    const savedDevPath = storage.getDevPath();
    
    setIsInitialized(initialized);
    setStartDateState(savedStartDate);
    setDevPathState(savedDevPath);
  }, []);

  const initialize = (startDateValue: string, devPathValue: string) => {
    storage.setInitialized(true);
    storage.setStartDate(startDateValue);
    storage.setDevPath(devPathValue);
    
    setIsInitialized(true);
    setStartDateState(startDateValue);
    setDevPathState(devPathValue);
  };

  const reset = () => {
    storage.clearAll();
    setIsInitialized(false);
    setStartDateState(null);
    setDevPathState(null);
  };

  return {
    isInitialized,
    startDate,
    devPath,
    initialize,
    reset
  };
}
