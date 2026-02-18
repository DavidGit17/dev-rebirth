import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDevLogs } from '../state/devLogs';
import { getTodayKey, formatDate } from '../lib/dates';
import { calculateDayScore } from '../lib/scoring';
import { COPY } from '../lib/copy';

export default function DailySummaryPage() {
  const navigate = useNavigate();
  const { getLogsForDate } = useDevLogs();

  const todayKey = getTodayKey();
  const todayLogs = getLogsForDate(todayKey);
  const score = calculateDayScore(todayLogs);

  const getMessage = () => {
    switch (score.performanceLevel) {
      case 'high':
        return COPY.SUMMARY_HIGH;
      case 'medium':
        return COPY.SUMMARY_MEDIUM;
      case 'low':
        return COPY.SUMMARY_LOW;
    }
  };

  const getMessageColor = () => {
    switch (score.performanceLevel) {
      case 'high':
        return 'text-success';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-destructive';
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-4">
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
            DAILY SUMMARY
          </CardTitle>
          <p className="paragraph-text text-xs text-muted-foreground">
            {formatDate(todayKey)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 mx-auto text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {score.totalHours.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground paragraph-text">
                DEV HOURS
              </div>
            </div>
            <div className="text-center space-y-2">
              <Target className="w-8 h-8 mx-auto text-secondary" />
              <div className="text-2xl font-bold text-foreground">
                {score.avgRelevance.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground paragraph-text">
                AVG RELEVANCE
              </div>
            </div>
            <div className="text-center space-y-2">
              <Zap className="w-8 h-8 mx-auto text-success" />
              <Badge variant="outline" className="font-rajdhani">
                {score.focusRating.toUpperCase()}
              </Badge>
              <div className="text-xs text-muted-foreground paragraph-text">
                FOCUS RATING
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <p className={`text-center text-lg font-bold paragraph-text ${getMessageColor()}`}>
              {getMessage()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => navigate({ to: '/dashboard' })}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-rajdhani text-lg tracking-wider h-12"
      >
        CONTINUE
      </Button>
    </div>
  );
}
