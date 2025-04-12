
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { MessageSquare } from "lucide-react";

interface MessagingData {
  name: string;
  messages: number;
}

interface MessagingAnalyticsProps {
  dailyData: MessagingData[];
  weeklyData: MessagingData[];
  monthlyData: MessagingData[];
  activeTimeframe: "daily" | "weekly" | "monthly";
}

const MessagingAnalytics = ({ 
  dailyData, 
  weeklyData, 
  monthlyData, 
  activeTimeframe 
}: MessagingAnalyticsProps) => {
  const getActiveData = () => {
    switch (activeTimeframe) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Messaging Analytics
        </CardTitle>
        <CardDescription>
          Total messages sent across the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getActiveData()}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 border rounded-md">
            <p className="text-sm text-muted-foreground">Average Messages Per User</p>
            <p className="text-2xl font-bold">24.5</p>
          </div>
          <div className="p-4 border rounded-md">
            <p className="text-sm text-muted-foreground">Total Messages Today</p>
            <p className="text-2xl font-bold">12,458</p>
          </div>
          <div className="p-4 border rounded-md">
            <p className="text-sm text-muted-foreground">Active Conversations</p>
            <p className="text-2xl font-bold">3,247</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagingAnalytics;
