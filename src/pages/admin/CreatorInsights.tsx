
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorPerformance from "@/components/creators/CreatorPerformance";
import { creatorPerformanceData } from "@/data/adminDashboardData";

const CreatorInsights = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creator Insights</h1>
          <p className="text-muted-foreground">Track creator performance, earnings, and engagement</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <CreatorPerformance creator={creatorPerformanceData} />
          
          {/* Additional creator insights components could be added here */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatorInsights;
