import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppState } from '../state/useAppState';
import { useDevLogs } from '../state/devLogs';
import { getDayNumber, getTodayKey, formatDate } from '../lib/dates';
import { getDailyQuote } from '../lib/quotes';
import { getDisciplineStatus, getProgressPercentage, calculateDayScore } from '../lib/scoring';
import { COPY } from '../lib/copy';
import ReminderBanner from '../components/reminders/ReminderBanner';
import ResetControl from '../components/settings/ResetControl';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { startDate } = useAppState();
  const { getLogsForDate } = useDevLogs();

  const todayKey = getTodayKey();
  const dayNumber = startDate ? getDayNumber(startDate, todayKey) : 1;
  const todayLogs = getLogsForDate(todayKey);
  const dayScore = calculateDayScore(todayLogs);
  const quote = getDailyQuote(todayKey);
  const disciplineStatus = getDisciplineStatus(dayScore.totalHours, dayScore.avgRelevance);
  const progress = getProgressPercentage(dayScore.totalHours);

  const logSections = [
    { section: 'morning', label: COPY.SECTIONS.MORNING },
    { section: 'afternoon', label: COPY.SECTIONS.AFTERNOON },
    { section: 'evening', label: COPY.SECTIONS.EVENING },
    { section: 'night', label: COPY.SECTIONS.NIGHT }
  ];

  return (
    <div className="container max-w-md mx-auto p-4 space-y-4">
      <Card className="cyber-card">
        <CardHeader className="text-center space-y-2">
          <div className="day-counter text-6xl text-primary cyber-glow">
            DAY {String(dayNumber).padStart(2, '0')}
          </div>
          <CardTitle className="heading text-sm text-muted-foreground">
            DAY {dayNumber} OF BECOMING A DEVELOPER
          </CardTitle>
          <p className="paragraph-text text-xs text-muted-foreground">
            {formatDate(todayKey)}
          </p>
        </CardHeader>
      </Card>

      <ReminderBanner />

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="heading text-sm text-primary">
            DISCIPLINE STATUS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="paragraph-text text-foreground font-semibold">
            {disciplineStatus}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs paragraph-text text-muted-foreground">
              <span>TODAY'S DEV PROGRESS</span>
              <span>{dayScore.totalHours.toFixed(1)}h / 8h</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="cyber-card">
        <CardContent className="pt-6">
          <p className="paragraph-text text-center text-primary italic">
            "{quote}"
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="heading text-xs text-muted-foreground mb-3">
          DAILY LOGGING
        </h3>
        {logSections.map(({ section, label }) => (
          <Button
            key={section}
            onClick={() => navigate({ to: '/log/$section', params: { section } })}
            variant="outline"
            className="w-full justify-start font-rajdhani text-base tracking-wider h-12 cyber-border"
          >
            {label} LOG
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => navigate({ to: '/reality-check' })}
          variant="outline"
          className="font-rajdhani tracking-wider cyber-border text-destructive border-destructive/30"
        >
          {COPY.REALITY_CHECK}
        </Button>
        <Button
          onClick={() => navigate({ to: '/history' })}
          variant="outline"
          className="font-rajdhani tracking-wider cyber-border"
        >
          HISTORY
        </Button>
        <Button
          onClick={() => navigate({ to: '/stats' })}
          variant="outline"
          className="font-rajdhani tracking-wider cyber-border col-span-2"
        >
          STATS & GROWTH
        </Button>
      </div>

      <div className="flex justify-center pt-4">
        <ResetControl />
      </div>

      <footer className="text-center text-xs text-muted-foreground paragraph-text pt-8 pb-4">
        <p>© {new Date().getFullYear()} Built with ❤️ using{' '}
          <a 
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
