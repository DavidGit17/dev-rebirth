import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { NonDevLog } from "../../state/nonDevLogs";

interface RealityPieChartProps {
  devHours: number;
  nonDevHours: number;
  nonDevLogs: NonDevLog[];
}

export default function RealityPieChart({
  devHours,
  nonDevHours,
  nonDevLogs,
}: RealityPieChartProps) {
  const activityBreakdown: Record<string, number> = {};

  nonDevLogs.forEach((log) => {
    const label = log.activityType.replace("_", " ").toUpperCase();
    activityBreakdown[label] = (activityBreakdown[label] || 0) + log.hours;
  });

  const data = [
    { name: "DEV WORK", value: devHours, color: "oklch(0.88 0.18 155)" },
    ...Object.entries(activityBreakdown).map(([name, value]) => ({
      name,
      value,
      color: "oklch(0.58 0.22 25)",
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => {
            const value = (percent ?? 0) * 100;
            return `${name} ${value.toFixed(0)}%`;
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "oklch(0.15 0.02 240)",
            border: "1px solid oklch(0.88 0.15 195 / 0.3)",
            borderRadius: "0",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
