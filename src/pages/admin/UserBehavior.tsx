
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserJourneyHeatmap from "@/components/analytics/UserJourneyHeatmap";
import UserBehaviorSegments from "@/components/analytics/UserBehaviorSegments";
import { userJourneyHeatmapData, userBehaviorSegmentsData } from "@/data/adminDashboardData";

const UserBehavior = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Behavior Analytics</h1>
          <p className="text-muted-foreground">Analyze user journeys and behavior patterns</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <UserJourneyHeatmap data={userJourneyHeatmapData} />
          
          <UserBehaviorSegments segments={userBehaviorSegmentsData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserBehavior;
