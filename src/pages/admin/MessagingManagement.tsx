import DashboardLayout from "@/components/layout/DashboardLayout";
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

const MessagingManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messaging Management</h1>
          <p className="text-muted-foreground">Monitor and moderate direct messages between users</p>
        </div>

        <NotAvailablePanel
          feature="Messaging Management"
          reason="There is no direct-messaging feature in the backend yet — no Message model, no moderation endpoints, no analytics. This screen previously showed static mock data; it's disabled until DM is actually built."
        />
      </div>
    </DashboardLayout>
  );
};

export default MessagingManagement;
