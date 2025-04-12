
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LikeAnalytics from "@/components/likes/LikeAnalytics";
import TopLikedContent from "@/components/likes/TopLikedContent";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";
import { likeAnalyticsData, topLikedVideos } from "@/data/adminDashboardData";

const LikesManagement = () => {
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'
  const timeframeLabels = {
    day: "Today",
    week: "This Week",
    month: "This Month"
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Likes Management</h1>
            <p className="text-muted-foreground">Track engagement and monitor content performance</p>
          </div>
          <TimeframeToggle timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <LikeAnalytics 
            dailyData={likeAnalyticsData.daily} 
            timeframe={timeframeLabels[timeframe as keyof typeof timeframeLabels]} 
          />
          
          <TopLikedContent videos={topLikedVideos} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LikesManagement;
