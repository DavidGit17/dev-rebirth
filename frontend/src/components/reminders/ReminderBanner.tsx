import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getCurrentReminder } from '../../lib/reminders';

export default function ReminderBanner() {
  const reminder = getCurrentReminder();

  return (
    <Alert className="cyber-border bg-card/50 backdrop-blur-sm">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertDescription className="font-rajdhani font-bold text-sm tracking-wider text-primary">
        {reminder}
      </AlertDescription>
    </Alert>
  );
}
