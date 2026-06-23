import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LikeAnalytics from "@/components/likes/LikeAnalytics";
import TopLikedContent from "@/components/likes/TopLikedContent";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";
import { getLikesTrend, getTopLikedVideos } from "@/lib/likesAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const TIMEFRAME_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

const LikesManagement = () => {
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'
  const days = TIMEFRAME_DAYS[timeframe] ?? 7;

  const trendQuery = useQuery({
    queryKey: queryKeys.likesTrend(days),
    queryFn: () => getLikesTrend(days),
  });

  const topVideosQuery = useQuery({
    queryKey: queryKeys.topLikedVideos,
    queryFn: () => getTopLikedVideos(10),
  });

  const chartData = (trendQuery.data ?? []).map((point) => ({
    name: point.date,
    likes: point.count,
  }));

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
          {trendQuery.isLoading ? (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : trendQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load likes trend.</p>
          ) : (
            <LikeAnalytics data={chartData} />
          )}

          {topVideosQuery.isLoading ? (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : topVideosQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load top liked videos.</p>
          ) : (
            <TopLikedContent videos={topVideosQuery.data ?? []} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LikesManagement;
