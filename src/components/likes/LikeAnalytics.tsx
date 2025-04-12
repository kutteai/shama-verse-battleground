
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface LikeData {
  name: string;
  likes: number;
}

interface LikeAnalyticsProps {
  dailyData: LikeData[];
  timeframe: string;
}

const LikeAnalytics = ({ dailyData, timeframe }: LikeAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Like Analytics
        </CardTitle>
        <CardDescription>
          Total likes across {timeframe}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone"
                dataKey="likes"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Total Likes</p>
            <p className="text-xl font-bold">458,293</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Avg. Likes per Video</p>
            <p className="text-xl font-bold">238</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Like-to-View Ratio</p>
            <p className="text-xl font-bold">18.2%</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Like Growth</p>
            <p className="text-xl font-bold text-green-500">+12.4%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LikeAnalytics;
