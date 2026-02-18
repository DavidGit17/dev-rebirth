import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useDevLogs } from '../state/devLogs';
import { useNonDevLogs } from '../state/nonDevLogs';
import { useAppState } from '../state/useAppState';
import { getDateKey, getDayNumber, formatDate, parseDateKey } from '../lib/dates';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { startDate } = useAppState();
  const { getLogsForDate: getDevLogs } = useDevLogs();
  const { getLogsForDate: getNonDevLogs } = useNonDevLogs();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedKey = getDateKey(selectedDate);
  
  const devLogs = getDevLogs(selectedKey);
  const nonDevLogs = getNonDevLogs(selectedKey);
  const dayNumber = startDate ? getDayNumber(startDate, selectedKey) : 0;
  const totalDevHours = devLogs.reduce((sum, log) => sum + log.hours, 0);

  return (
    <div className="container max-w-md mx-auto p-4 space-y-4 pb-24">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: '/dashboard' })}
        className="font-rajdhani"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        BACK
      </Button>

      <Card className="cyber-card">
        <CardHeader className="text-center">
          <CardTitle className="heading text-2xl text-primary">
            HISTORY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start font-rajdhani cyber-border">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDate(selectedKey)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 cyber-card">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground paragraph-text">DAY NUMBER</p>
              <p className="text-2xl font-bold text-primary">{dayNumber}</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground paragraph-text">DEV HOURS</p>
              <p className="text-2xl font-bold text-success">{totalDevHours.toFixed(1)}h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {devLogs.length > 0 && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="heading text-sm text-primary">
              DEV LOGS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {devLogs.map((log) => (
                <AccordionItem key={log.section} value={log.section}>
                  <AccordionTrigger className="font-rajdhani text-sm">
                    {log.section.toUpperCase()} - {log.hours}h
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2 paragraph-text text-sm">
                    <p><strong>Description:</strong> {log.description || 'None'}</p>
                    <p><strong>Activities:</strong> {log.activities.join(', ') || 'None'}</p>
                    <p><strong>Relevance:</strong> {log.relevance}/10</p>
                    <p><strong>Focus:</strong> {log.focus}</p>
                    {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {nonDevLogs.length > 0 && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="heading text-sm text-destructive">
              NON-DEV LOGS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nonDevLogs.map((log) => (
              <div key={log.id} className="p-3 bg-muted/20 rounded space-y-1">
                <div className="flex justify-between items-start">
                  <p className="paragraph-text text-sm font-semibold">
                    {log.activityType.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-lg font-bold text-destructive">
                    {log.hours.toFixed(1)}h
                  </p>
                </div>
                <p className="paragraph-text text-xs text-muted-foreground">
                  {log.category.replace('_', ' ')} • {log.mood}
                </p>
                {log.notes && (
                  <p className="paragraph-text text-xs text-muted-foreground italic">
                    {log.notes}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {devLogs.length === 0 && nonDevLogs.length === 0 && (
        <Card className="cyber-card">
          <CardContent className="pt-6 text-center">
            <p className="paragraph-text text-muted-foreground">
              No logs for this date
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
