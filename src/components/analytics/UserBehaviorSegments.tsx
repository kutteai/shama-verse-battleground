
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { User, UserCheck } from "lucide-react";

interface UserSegment {
  name: string;
  value: number;
  color: string;
  description: string;
}

interface UserBehaviorSegmentsProps {
  segments: UserSegment[];
}

const UserBehaviorSegments = ({ segments }: UserBehaviorSegmentsProps) => {
  const totalUsers = segments.reduce((sum, segment) => sum + segment.value, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <UserCheck className="h-5 w-5 mr-2 text-violet-500" />
          User Behavior Segments
        </CardTitle>
        <CardDescription>
          Breakdown of user types based on platform behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {segments.map((segment, index) => (
                    <Cell key={`cell-${index}`} fill={segment.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toLocaleString()} users`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {segments.map((segment) => (
              <div key={segment.name} className="p-3 border rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></div>
                    <h3 className="text-sm font-medium">{segment.name}</h3>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold">{segment.value.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({((segment.value / totalUsers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBehaviorSegments;
