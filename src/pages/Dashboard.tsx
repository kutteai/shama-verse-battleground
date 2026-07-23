
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SimpleAreaChart from "@/components/dashboard/SimpleAreaChart";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";
import RevenueStatsCard from "@/components/dashboard/RevenueStatsCard";
import MostGiftedUsersCard from "@/components/dashboard/MostGiftedUsersCard";
import RetentionCard from "@/components/dashboard/RetentionCard";
import EngagementCard from "@/components/dashboard/EngagementCard";
import TopFollowedUsers from "@/components/following/TopFollowedUsers";

import {
  Users,
  Activity,
  TrendingUp,
  Calendar,
  UserPlus,
  Video,
  Clock,
  UploadCloud,
} from "lucide-react";

import { getDashboardSummary, getDashboardTrends } from "@/lib/dashboardAdminApi";
import { getTopFollowedUsers } from "@/lib/followingAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const TIMEFRAME_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

const TIMEFRAME_LABEL: Record<string, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
};

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'
  const days = TIMEFRAME_DAYS[timeframe] ?? 7;
  const periodLabel = TIMEFRAME_LABEL[timeframe] ?? "This Week";

  const summaryQuery = useQuery({
    queryKey: queryKeys.dashboardSummary(days),
    queryFn: () => getDashboardSummary(days),
  });

  const trendsQuery = useQuery({
    queryKey: queryKeys.dashboardTrends(days),
    queryFn: () => getDashboardTrends(days),
  });

  const topUsersQuery = useQuery({
    queryKey: queryKeys.topFollowedUsers,
    queryFn: () => getTopFollowedUsers(5),
  });

  if (summaryQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-shama-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <DashboardLayout>
        <p className="text-sm text-destructive">Failed to load dashboard summary.</p>
      </DashboardLayout>
    );
  }

  const summary = summaryQuery.data;

  const signupsChartData = (trendsQuery.data?.user_signups ?? []).map((point) => ({
    name: point.date,
    users: point.count,
  }));

  const contentDates = Array.from(
    new Set([
      ...(trendsQuery.data?.challenges_created ?? []).map((p) => p.date),
      ...(trendsQuery.data?.videos_created ?? []).map((p) => p.date),
    ])
  ).sort();
  const challengesByDate = new Map((trendsQuery.data?.challenges_created ?? []).map((p) => [p.date, p.count]));
  const videosByDate = new Map((trendsQuery.data?.videos_created ?? []).map((p) => [p.date, p.count]));
  const contentChartData = contentDates.map((date) => ({
    name: date,
    challenges: challengesByDate.get(date) ?? 0,
    videos: videosByDate.get(date) ?? 0,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Platform analytics and key metrics.</p>
          </div>
          <TimeframeToggle timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>

        {/* All Time — snapshots that don't move with the timeframe toggle */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">All Time</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard title="Total Users" value={summary.total_users.toLocaleString()} icon={<Users size={24} />} />
            <StatCard title="Active Users" value={summary.active_users.toLocaleString()} icon={<Activity size={24} />} />
            <StatCard title="Total Challenges" value={summary.total_challenges.toLocaleString()} icon={<TrendingUp size={24} />} />
            <StatCard title="Running Challenges" value={summary.running_challenges.toLocaleString()} icon={<Calendar size={24} />} />
            <StatCard title="Total Videos" value={summary.total_videos.toLocaleString()} icon={<Video size={24} />} />
          </div>
        </div>

        {/* This Period — everything here moves with the timeframe toggle */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">{periodLabel}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title={`New Users (${periodLabel})`} value={summary.new_signups.toLocaleString()} icon={<UserPlus size={24} />} />
            <StatCard title={`Active Users (${periodLabel})`} value={summary.active_in_period.toLocaleString()} icon={<Clock size={24} />} />
            <StatCard title={`New Challenges (${periodLabel})`} value={summary.new_challenges.toLocaleString()} icon={<TrendingUp size={24} />} />
            <StatCard title={`New Videos (${periodLabel})`} value={summary.new_videos.toLocaleString()} icon={<UploadCloud size={24} />} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {trendsQuery.isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : trendsQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load signup trend.</p>
          ) : (
            <SimpleAreaChart
              title="New User Signups"
              description="New user registrations over the selected period"
              data={signupsChartData}
              dataKeys={[{ key: "users", color: "#9C27B0", name: "New Users" }]}
            />
          )}
          {trendsQuery.isLoading ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : trendsQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load content trend.</p>
          ) : (
            <SimpleAreaChart
              title="Challenges & Videos Created"
              description="Content creation over the selected period"
              data={contentChartData}
              dataKeys={[
                { key: "challenges", color: "#4CAF50", name: "Challenges Created" },
                { key: "videos", color: "#3F51B5", name: "Videos Created" },
              ]}
            />
          )}
        </div>

        {/* Retention and Engagement Stats Row — coming soon, no backing data yet */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RetentionCard data={{ day1: 0, day7: 0, day30: 0, day90: 0 }} />
          <EngagementCard data={[]} />
        </div>

        {/* Revenue and Gifts Row — coming soon, no payment/gifting model yet */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueStatsCard />
          <MostGiftedUsersCard users={[]} />
        </div>

        {/* User Stats Row */}
        {topUsersQuery.isLoading ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : topUsersQuery.isError ? (
          <p className="text-sm text-destructive">Failed to load top followed users.</p>
        ) : (
          <TopFollowedUsers users={topUsersQuery.data ?? []} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
