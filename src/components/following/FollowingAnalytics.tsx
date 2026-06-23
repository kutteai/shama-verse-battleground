
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface FollowData {
  name: string;
  follows: number;
}

interface FollowingAnalyticsProps {
  data: FollowData[];
}

const FollowingAnalytics = ({ data }: FollowingAnalyticsProps) => {
  const totalFollows = data.reduce((sum, day) => sum + day.follows, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-indigo-500" />
          Following Analytics
        </CardTitle>
        <CardDescription>
          New follows over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Total New Follows</p>
            <p className="text-xl font-bold">{totalFollows.toLocaleString()}</p>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="follows"
                stroke="#4f46e5"
                fill="#818cf8"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowingAnalytics;
