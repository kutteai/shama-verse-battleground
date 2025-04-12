
import DashboardLayout from "@/components/layout/DashboardLayout";
import ErrorLogging from "@/components/system/ErrorLogging";
import ApiStatus from "@/components/system/ApiStatus";
import { errorLogData, apiStatusData } from "@/data/adminDashboardData";

const SystemTools = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Tools</h1>
          <p className="text-muted-foreground">Monitor system health, errors, and API status</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ApiStatus 
            endpoints={apiStatusData.endpoints} 
            lastUpdated={apiStatusData.lastUpdated}
          />
          
          <ErrorLogging errors={errorLogData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemTools;
