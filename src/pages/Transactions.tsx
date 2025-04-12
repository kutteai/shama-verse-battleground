
import DashboardLayout from "@/components/layout/DashboardLayout";

const Transactions = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions & Payments</h1>
          <p className="text-muted-foreground">View and manage all platform transactions.</p>
        </div>
        
        <div className="border rounded-lg p-8 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Transaction management functionality coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
