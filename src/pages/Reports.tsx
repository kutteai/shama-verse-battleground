
import DashboardLayout from "@/components/layout/DashboardLayout";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Moderation</h1>
          <p className="text-muted-foreground">View and manage flagged content and user reports.</p>
        </div>
        
        <div className="border rounded-lg p-8 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Reports management functionality coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
