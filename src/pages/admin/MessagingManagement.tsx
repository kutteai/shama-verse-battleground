
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessageModeration from "@/components/messaging/MessageModeration";
import MessagingAnalytics from "@/components/messaging/MessagingAnalytics";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";
import { flaggedMessages, messagingAnalyticsData } from "@/data/adminDashboardData";

const MessagingManagement = () => {
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messaging & Communication</h1>
            <p className="text-muted-foreground">Manage messages, moderate content, and view analytics</p>
          </div>
          <TimeframeToggle timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <MessagingAnalytics 
            dailyData={messagingAnalyticsData.daily}
            weeklyData={messagingAnalyticsData.weekly}
            monthlyData={messagingAnalyticsData.monthly}
            activeTimeframe={timeframe as "daily" | "weekly" | "monthly"}
          />
          
          <MessageModeration flaggedMessages={flaggedMessages} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagingManagement;
