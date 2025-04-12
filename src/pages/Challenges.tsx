
import DashboardLayout from "@/components/layout/DashboardLayout";

const Challenges = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges Management</h1>
          <p className="text-muted-foreground">Create and manage user challenges.</p>
        </div>
        
        <div className="border rounded-lg p-8 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Challenge management functionality coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Challenges;
