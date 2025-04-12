
import DashboardLayout from "@/components/layout/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and parameters.</p>
        </div>
        
        <div className="border rounded-lg p-8 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Settings management functionality coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
