import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";
import ImpressionTrendChart from "@/components/impressions/ImpressionTrendChart";
import TopViewedVideos from "@/components/impressions/TopViewedVideos";
import TopViewedChallenges from "@/components/impressions/TopViewedChallenges";
import { FileText, Swords, Video } from "lucide-react";

import {
  getVideoImpressionsTrend,
  getChallengeImpressionsTrend,
  getTopViewedVideos,
  getTopViewedChallenges,
} from "@/lib/impressionsAdminApi";
import { getPageViewsTrend } from "@/lib/pagesAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const TIMEFRAME_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

const ImpressionsAnalytics = () => {
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'
  const days = TIMEFRAME_DAYS[timeframe] ?? 7;

  const pageTrendQuery = useQuery({
    queryKey: queryKeys.pageViewsTrend(days),
    queryFn: () => getPageViewsTrend(days),
  });

  const videoTrendQuery = useQuery({
    queryKey: queryKeys.videoImpressionsTrend(days),
    queryFn: () => getVideoImpressionsTrend(days),
  });

  const challengeTrendQuery = useQuery({
    queryKey: queryKeys.challengeImpressionsTrend(days),
    queryFn: () => getChallengeImpressionsTrend(days),
  });

  const topVideosQuery = useQuery({
    queryKey: queryKeys.topViewedVideos,
    queryFn: () => getTopViewedVideos(10),
  });

  const topChallengesQuery = useQuery({
    queryKey: queryKeys.topViewedChallenges,
    queryFn: () => getTopViewedChallenges(10),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Impressions</h1>
            <p className="text-muted-foreground">
              Screen, video, and challenge views — each counted once per user.
            </p>
          </div>
          <TimeframeToggle timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pageTrendQuery.isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : pageTrendQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load page views trend.</p>
          ) : (
            <ImpressionTrendChart
              title="Page Views"
              description="Screen views over the selected period"
              icon={FileText}
              color="#9C27B0"
              data={pageTrendQuery.data ?? []}
            />
          )}

          {videoTrendQuery.isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : videoTrendQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load video impressions trend.</p>
          ) : (
            <ImpressionTrendChart
              title="Video Impressions"
              description="Video views over the selected period"
              icon={Video}
              color="#3F51B5"
              data={videoTrendQuery.data ?? []}
            />
          )}

          {challengeTrendQuery.isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : challengeTrendQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load challenge impressions trend.</p>
          ) : (
            <ImpressionTrendChart
              title="Challenge Impressions"
              description="Challenge views over the selected period"
              icon={Swords}
              color="#4CAF50"
              data={challengeTrendQuery.data ?? []}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {topVideosQuery.isLoading ? (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : topVideosQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load top viewed videos.</p>
          ) : (
            <TopViewedVideos videos={topVideosQuery.data ?? []} />
          )}

          {topChallengesQuery.isLoading ? (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : topChallengesQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load top viewed challenges.</p>
          ) : (
            <TopViewedChallenges challenges={topChallengesQuery.data ?? []} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImpressionsAnalytics;
