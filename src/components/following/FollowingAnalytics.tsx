
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface FollowData {
  name: string;
  follows: number;
  unfollows: number;
}

interface FollowingAnalyticsProps {
  weeklyData: FollowData[];
}

const FollowingAnalytics = ({ weeklyData }: FollowingAnalyticsProps) => {
  // Calculate net follows
  const totalFollows = weeklyData.reduce((sum, day) => sum + day.follows, 0);
  const totalUnfollows = weeklyData.reduce((sum, day) => sum + day.unfollows, 0);
  const netGrowth = totalFollows - totalUnfollows;
  const growthPercent = totalFollows > 0 ? ((netGrowth / totalFollows) * 100).toFixed(1) : "0.0";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <UserPlus className="h-5 w-5 mr-2 text-indigo-500" />
          Following Analytics
        </CardTitle>
        <CardDescription>
          Follow and unfollow patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Total New Follows</p>
            <p className="text-xl font-bold">{totalFollows.toLocaleString()}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Total Unfollows</p>
            <p className="text-xl font-bold">{totalUnfollows.toLocaleString()}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Net Growth</p>
            <p className={`text-xl font-bold ${netGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {netGrowth >= 0 ? "+" : ""}{netGrowth.toLocaleString()} ({growthPercent}%)
            </p>
          </div>
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="follows" 
                stackId="1" 
                stroke="#4f46e5" 
                fill="#818cf8"
              />
              <Area 
                type="monotone" 
                dataKey="unfollows" 
                stackId="2" 
                stroke="#ef4444" 
                fill="#fca5a5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowingAnalytics;
