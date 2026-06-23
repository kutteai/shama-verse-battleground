
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface LikeData {
  name: string;
  likes: number;
}

interface LikeAnalyticsProps {
  data: LikeData[];
}

const LikeAnalytics = ({ data }: LikeAnalyticsProps) => {
  const totalLikes = data.reduce((sum, day) => sum + day.likes, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Like Analytics
        </CardTitle>
        <CardDescription>
          New likes over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Total Likes (period)</p>
            <p className="text-xl font-bold">{totalLikes.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LikeAnalytics;
