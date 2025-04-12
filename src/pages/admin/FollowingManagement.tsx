
import DashboardLayout from "@/components/layout/DashboardLayout";
import FollowingAnalytics from "@/components/following/FollowingAnalytics";
import TopFollowedUsers from "@/components/following/TopFollowedUsers";
import { followingAnalyticsData, topFollowedUsers } from "@/data/adminDashboardData";

const FollowingManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Following System</h1>
          <p className="text-muted-foreground">Track follow/unfollow patterns and top followed users</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FollowingAnalytics weeklyData={followingAnalyticsData.weekly} />
          
          <TopFollowedUsers users={topFollowedUsers} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FollowingManagement;
