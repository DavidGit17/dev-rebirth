import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDevLogs } from '../../state/devLogs';
import { useNonDevLogs } from '../../state/nonDevLogs';
import { getTodayKey } from '../../lib/dates';
import { calculateWeeklyDistraction, getMostCommonDistraction, calculateDisciplineScore, getDisciplineTier } from '../../lib/analytics';
import { COPY } from '../../lib/copy';

export default function RealityAnalytics() {
  const { getTotalHoursForDate: getDevHours, devLogs } = useDevLogs();
  const { getTotalHoursForDate: getNonDevHours, nonDevLogs } = useNonDevLogs();

  const todayKey = getTodayKey();
  const devHours = getDevHours(todayKey);
  const nonDevHours = getNonDevHours(todayKey);

  const weeklyDistraction = calculateWeeklyDistraction(nonDevLogs);
  const mostCommon = getMostCommonDistraction(nonDevLogs);
  const disciplineScore = calculateDisciplineScore(devHours, nonDevHours);
  const tier = getDisciplineTier(disciplineScore);

  const getTierColor = () => {
    if (disciplineScore >= 80) return 'text-success';
    if (disciplineScore >= 50) return 'text-primary';
    return 'text-destructive';
  };

  return (
    <Card className="cyber-card">
      <CardHeader>
        <CardTitle className="heading text-sm text-primary">
          REALITY ANALYTICS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground paragraph-text">
              WEEKLY DISTRACTION
            </p>
            <p className="text-2xl font-bold text-destructive">
              {weeklyDistraction.toFixed(1)}h
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground paragraph-text">
              MOST COMMON
            </p>
            <p className="text-sm font-bold text-foreground paragraph-text">
              {mostCommon.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="heading text-xs text-muted-foreground">
              {COPY.DISCIPLINE_SCORE}
            </span>
            <Badge variant="outline" className={`font-rajdhani ${getTierColor()}`}>
              {tier}
            </Badge>
          </div>
          <div className="text-center">
            <span className={`text-4xl font-bold ${getTierColor()}`}>
              {disciplineScore}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
