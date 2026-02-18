import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAppState } from '../../state/useAppState';

export default function ResetControl() {
  const { reset } = useAppState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    reset();
    setOpen(false);
    navigate({ to: '/initialize' });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="font-rajdhani">
          <AlertTriangle className="w-4 h-4 mr-2" />
          RESET ALL DATA
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="cyber-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="heading text-destructive">
            CONFIRM SYSTEM RESET
          </AlertDialogTitle>
          <AlertDialogDescription className="paragraph-text">
            This will permanently delete all your logs, progress, and statistics. 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-rajdhani">CANCEL</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleReset}
            className="bg-destructive text-destructive-foreground font-rajdhani"
          >
            CONFIRM RESET
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
