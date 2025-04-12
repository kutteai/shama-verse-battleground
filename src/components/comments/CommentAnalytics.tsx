
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, MessageCircle } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface CommentData {
  name: string;
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}

interface CommentAnalyticsProps {
  data: CommentData[];
  totalComments: number;
  avgCommentsPerContent: number;
  commentEngagementRate: string;
}

const CommentAnalytics = ({ 
  data, 
  totalComments, 
  avgCommentsPerContent, 
  commentEngagementRate 
}: CommentAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
          Comment Analytics
        </CardTitle>
        <CardDescription>
          Analytics for comments across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Total Comments</p>
            <p className="text-xl font-bold">{totalComments.toLocaleString()}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Avg. Comments per Content</p>
            <p className="text-xl font-bold">{avgCommentsPerContent.toFixed(1)}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Comment Engagement Rate</p>
            <p className="text-xl font-bold">{commentEngagementRate}</p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="positive" stackId="a" fill="#22c55e" name="Positive" />
              <Bar dataKey="neutral" stackId="a" fill="#94a3b8" name="Neutral" />
              <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center items-center gap-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
            <span className="text-xs">Positive</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-slate-400 rounded-sm mr-2"></div>
            <span className="text-xs">Neutral</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-sm mr-2"></div>
            <span className="text-xs">Negative</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentAnalytics;
