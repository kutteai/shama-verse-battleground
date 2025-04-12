
import DashboardLayout from "@/components/layout/DashboardLayout";

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications & Announcements</h1>
          <p className="text-muted-foreground">Manage platform notifications and send announcements to users.</p>
        </div>
        
        <div className="border rounded-lg p-8 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Notification management functionality coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
