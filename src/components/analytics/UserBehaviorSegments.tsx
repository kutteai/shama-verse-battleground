
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { UserCheck } from "lucide-react";
import type { UserSegment } from "@/lib/userBehaviorApi";

const SEGMENT_COLORS = ["#8b5cf6", "#3b82f6", "#22c55e", "#f97316", "#ef4444"];

interface UserBehaviorSegmentsProps {
  segments: UserSegment[];
}

const UserBehaviorSegments = ({ segments }: UserBehaviorSegmentsProps) => {
  const chartData = segments.map((seg, i) => ({
    name: seg.name,
    value: seg.count,
    color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <UserCheck className="h-5 w-5 mr-2 text-violet-500" />
          User Behavior Segments
        </CardTitle>
        <CardDescription>Breakdown of user types based on activity thresholds</CardDescription>
      </CardHeader>
      <CardContent>
        {segments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No segment data yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} users`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {segments.map((segment, i) => (
                <div key={segment.name} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                      />
                      <h3 className="text-sm font-medium">{segment.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold">{segment.count.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground ml-1">({segment.percentage}%)</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{segment.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBehaviorSegments;
