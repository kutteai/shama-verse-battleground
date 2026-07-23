import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LucideIcon } from "lucide-react";
import type { TrendPoint } from "@/lib/impressionsAdminApi";

interface ImpressionTrendChartProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  data: TrendPoint[];
}

const ImpressionTrendChart = ({ title, description, icon: Icon, color, data }: ImpressionTrendChartProps) => {
  const chartData = data.map((point) => ({ name: point.date, count: point.count }));
  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Icon className="h-5 w-5 mr-2" style={{ color }} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Total (period)</p>
            <p className="text-xl font-bold">{total.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpressionTrendChart;
