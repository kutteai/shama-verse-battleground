
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FollowingAnalytics from "@/components/following/FollowingAnalytics";
import TopFollowedUsers from "@/components/following/TopFollowedUsers";
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";
import { getFollowTrends, getTopFollowedUsers } from "@/lib/followingAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const FollowingManagement = () => {
  const trendsQuery = useQuery({
    queryKey: queryKeys.followTrends(30),
    queryFn: () => getFollowTrends(30),
  });

  const topUsersQuery = useQuery({
    queryKey: queryKeys.topFollowedUsers,
    queryFn: () => getTopFollowedUsers(10),
  });

  const chartData = (trendsQuery.data ?? []).map((point) => ({
    name: point.date,
    follows: point.count,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Following System</h1>
          <p className="text-muted-foreground">Track follow patterns and top followed users</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {trendsQuery.isLoading ? (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : trendsQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load follow trends.</p>
          ) : (
            <FollowingAnalytics data={chartData} />
          )}

          <NotAvailablePanel
            feature="Unfollow Trends"
            reason="Unfollows are hard-deleted when they happen, so there is no historical record to chart."
          />

          {topUsersQuery.isLoading ? (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading...</div>
          ) : topUsersQuery.isError ? (
            <p className="text-sm text-destructive">Failed to load top followed users.</p>
          ) : (
            <TopFollowedUsers users={topUsersQuery.data ?? []} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FollowingManagement;
