import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDevLogs } from '../state/devLogs';
import { useNonDevLogs } from '../state/nonDevLogs';
import { getTodayKey, formatDate } from '../lib/dates';
import { COPY } from '../lib/copy';
import NonDevLogForm from '../components/reality/NonDevLogForm';
import RealityAnalytics from '../components/reality/RealityAnalytics';
import RealityPieChart from '../components/charts/RealityPieChart';

export default function RealityCheckPage() {
  const navigate = useNavigate();
  const { getTotalHoursForDate: getDevHours } = useDevLogs();
  const { getTotalHoursForDate: getNonDevHours, getLogsForDate } = useNonDevLogs();
  const [showForm, setShowForm] = useState(false);

  const todayKey = getTodayKey();
  const devHours = getDevHours(todayKey);
  const nonDevHours = getNonDevHours(todayKey);
  const totalHours = devHours + nonDevHours;
  const nonDevLogs = getLogsForDate(todayKey);

  const devPercentage = totalHours > 0 ? (devHours / totalHours) * 100 : 0;
  const message = devHours > nonDevHours ? COPY.REALITY_DOMINATES : COPY.REALITY_DISTRACTIONS;
  const messageColor = devHours > nonDevHours ? 'text-success' : 'text-destructive';

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
          <CardTitle className="heading text-2xl text-destructive">
            {COPY.REALITY_CHECK}
          </CardTitle>
          <p className="paragraph-text text-xs text-muted-foreground">
            {formatDate(todayKey)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-success">
                {devHours.toFixed(1)}h
              </div>
              <div className="text-xs text-muted-foreground paragraph-text">
                DEV HOURS
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-destructive">
                {nonDevHours.toFixed(1)}h
              </div>
              <div className="text-xs text-muted-foreground paragraph-text">
                NON-DEV HOURS
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs paragraph-text text-muted-foreground">
              <span>DEV</span>
              <span>DISTRACTION</span>
            </div>
            <div className="relative h-4 bg-destructive/20 rounded-none overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-success transition-all"
                style={{ width: `${devPercentage}%` }}
              />
            </div>
          </div>

          <p className={`text-center text-lg font-bold paragraph-text ${messageColor}`}>
            {message}
          </p>
        </CardContent>
      </Card>

      {totalHours > 0 && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="heading text-sm text-primary flex items-center">
              <PieChartIcon className="w-4 h-4 mr-2" />
              TIME DISTRIBUTION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RealityPieChart devHours={devHours} nonDevHours={nonDevHours} nonDevLogs={nonDevLogs} />
          </CardContent>
        </Card>
      )}

      <RealityAnalytics />

      {nonDevHours > 4 && (
        <Alert className="cyber-border bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="font-rajdhani font-bold text-sm tracking-wider text-destructive">
            {COPY.WARNING_SLIPPING}
          </AlertDescription>
        </Alert>
      )}

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="heading text-sm text-primary">
            LOG NON-DEV ACTIVITY
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="w-full font-rajdhani tracking-wider cyber-border"
            >
              ADD DISTRACTION LOG
            </Button>
          ) : (
            <NonDevLogForm onSaved={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
          )}
        </CardContent>
      </Card>

      {nonDevLogs.length > 0 && (
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="heading text-sm text-muted-foreground">
              TODAY'S DISTRACTIONS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nonDevLogs.map(log => (
              <div key={log.id} className="flex justify-between items-center p-3 bg-muted/20 rounded">
                <div className="space-y-1">
                  <p className="paragraph-text text-sm font-semibold">
                    {log.activityType.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="paragraph-text text-xs text-muted-foreground">
                    {log.category.replace('_', ' ')} • {log.mood}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-destructive">
                    {log.hours.toFixed(1)}h
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
