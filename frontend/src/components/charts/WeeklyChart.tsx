import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DevLog } from '../../state/devLogs';
import { getLast7DaysKeys } from '../../lib/dates';

interface WeeklyChartProps {
  devLogs: Record<string, DevLog[]>;
}

export default function WeeklyChart({ devLogs }: WeeklyChartProps) {
  const last7Days = getLast7DaysKeys();

  const data = last7Days.map(dateKey => {
    const logs = devLogs[dateKey] || [];
    const totalHours = logs.reduce((sum, log) => sum + log.hours, 0);
    const date = new Date(dateKey);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      name: dayName,
      hours: parseFloat(totalHours.toFixed(1))
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 240)" />
        <XAxis 
          dataKey="name" 
          stroke="oklch(0.68 0.02 220)"
          style={{ fontSize: '12px', fontFamily: 'Rajdhani' }}
        />
        <YAxis 
          stroke="oklch(0.68 0.02 220)"
          style={{ fontSize: '12px', fontFamily: 'Rajdhani' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'oklch(0.15 0.02 240)', 
            border: '1px solid oklch(0.88 0.15 195 / 0.3)',
            borderRadius: '0',
            fontFamily: 'Exo 2'
          }}
        />
        <Bar dataKey="hours" fill="oklch(0.88 0.15 195)" name="Dev Hours" />
      </BarChart>
    </ResponsiveContainer>
  );
}
