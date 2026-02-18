import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Award, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDevLogs } from '../state/devLogs';
import { useAppState } from '../state/useAppState';
import { useBadges } from '../state/badges';
import { calculateStats, getMonthlyDiscipline } from '../lib/stats';
import WeeklyChart from '../components/charts/WeeklyChart';
import { useEffect } from 'react';

const BADGE_DEFINITIONS = [
  { id: '7_day_streak', name: '7 DAY STREAK', description: 'Logged dev work for 7 consecutive days', icon: '🔥' },
  { id: '30_day_streak', name: '30 DAY STREAK', description: 'Logged dev work for 30 consecutive days', icon: '💪' },
  { id: '100_hours', name: '100 HOURS', description: 'Accumulated 100 hours of dev work', icon: '⚡' },
  { id: 'no_zero_days', name: 'NO ZERO DAYS', description: 'Current streak of 7+ days', icon: '🎯' }
];

export default function StatsGrowthPage() {
  const navigate = useNavigate();
  const { startDate } = useAppState();
  const { devLogs } = useDevLogs();
  const { badges, checkAndUnlockBadges } = useBadges();

  const stats = calculateStats(devLogs, startDate || '');
  const monthlyDiscipline = getMonthlyDiscipline(devLogs);

  useEffect(() => {
    checkAndUnlockBadges(stats);
  }, [stats.longestStreak, stats.currentStreak, stats.totalDevHours]);

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
            STATS & GROWTH
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 mx-auto text-primary" />
              <div className="text-3xl font-bold text-foreground">
                {stats.totalDays}
              </div>
              <div className="text-xs text-muted-foreground paragraph-text">
                DAYS TRACKED
              </div>
            </div>
            <div className="text-center space-y-2">
              <Target className="w-8 h-8 mx-auto text-success" />
              <div className="text-3xl font-bold text-foreground">
                {stats.totalDevHours.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground paragraph-text">
                TOTAL DEV HOURS
              </div>
            </div>
            <div className="text-center space-y-2">
              <Zap className="w-8 h-8 mx-auto text-secondary" />
              <div className="text-3xl font-bold text-foreground">
                {stats.avgRelevance.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground paragraph-text">
                AVG RELEVANCE
              </div>
            </div>
            <div className="text-center space-y-2">
              <Award className="w-8 h-8 mx-auto text-primary" />
              <div className="text-3xl font-bold text-foreground">
                {stats.longestStreak}
              </div>
              <div className="text-xs text-muted-foreground paragraph-text">
                LONGEST STREAK
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="heading text-xs text-muted-foreground">
                CURRENT STREAK
              </span>
              <Badge variant="outline" className="font-rajdhani text-primary">
                {stats.currentStreak} DAYS
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="heading text-xs text-muted-foreground">
                MONTHLY DISCIPLINE
              </span>
              <Badge variant="outline" className="font-rajdhani text-success">
                {monthlyDiscipline}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="heading text-sm text-primary">
            WEEKLY PROGRESS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyChart devLogs={devLogs} />
        </CardContent>
      </Card>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="heading text-sm text-primary flex items-center">
            <Award className="w-4 h-4 mr-2" />
            BADGES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {BADGE_DEFINITIONS.map((badge) => {
              const isUnlocked = badges[badge.id];
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded text-center space-y-2 transition-all ${
                    isUnlocked
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-muted/10 border border-muted/30 opacity-50'
                  }`}
                >
                  <div className="text-3xl">{badge.icon}</div>
                  <p className="font-rajdhani text-xs font-bold tracking-wider">
                    {badge.name}
                  </p>
                  <p className="paragraph-text text-xs text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
