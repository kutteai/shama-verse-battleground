
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { DateRange } from "react-day-picker";

// Import components
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionDetails } from "@/components/transactions/TransactionDetails";
import { RevenueOverview } from "@/components/transactions/RevenueOverview";
import { PayoutStatistics } from "@/components/transactions/PayoutStatistics";
import { ProcessingStatus } from "@/components/transactions/ProcessingStatus";

// Import types
import { Transaction, RevenueData, PayoutStats } from "@/types/transactions";

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: "tx_123456",
    user: {
      id: "u_112233",
      username: "FlowMaster",
      avatar: null
    },
    type: "gift_purchase",
    amount: 49.99,
    fee: 2.50,
    net: 47.49,
    status: "completed",
    description: "Purchase of 500 Gift Credits",
    created_at: "2025-04-11T14:30:00Z",
    payment_method: "visa",
    payment_details: "**** 4242",
    related_id: "gift_12345"
  },
  {
    id: "tx_234567",
    user: {
      id: "u_223344",
      username: "LyricistPro",
      avatar: null
    },
    type: "challenge_entry",
    amount: 25.00,
    fee: 1.25,
    net: 23.75,
    status: "completed",
    description: "Entry fee for 'Summer Vibes Battle'",
    created_at: "2025-04-10T18:45:00Z",
    payment_method: "mastercard",
    payment_details: "**** 5555",
    related_id: "ch_67890"
  },
  {
    id: "tx_345678",
    user: {
      id: "u_334455",
      username: "BeatBoxKing",
      avatar: null
    },
    type: "payout",
    amount: -120.00,
    fee: 3.50,
    net: -123.50,
    status: "completed",
    description: "Monthly payout to connected bank account",
    created_at: "2025-04-09T12:15:00Z",
    payment_method: "bank_transfer",
    payment_details: "Ending in 1234",
    related_id: "po_24680"
  },
  {
    id: "tx_456789",
    user: {
      id: "u_445566",
      username: "RhymeQueen",
      avatar: null
    },
    type: "gift_purchase",
    amount: 19.99,
    fee: 1.00,
    net: 18.99,
    status: "failed",
    description: "Purchase of 200 Gift Credits (Failed)",
    created_at: "2025-04-09T09:30:00Z",
    payment_method: "visa",
    payment_details: "**** 9876",
    related_id: "gift_54321",
    error_message: "Insufficient funds"
  },
  {
    id: "tx_567890",
    user: {
      id: "u_556677",
      username: "ThoughtfulMC",
      avatar: null
    },
    type: "challenge_earnings",
    amount: 75.00,
    fee: 7.50,
    net: 67.50,
    status: "pending",
    description: "Earnings from winning 'Freestyle Friday' challenge",
    created_at: "2025-04-08T22:00:00Z",
    payment_method: null,
    payment_details: null,
    related_id: "ch_13579"
  },
  {
    id: "tx_678901",
    user: {
      id: "u_667788",
      username: "OldSchoolFan",
      avatar: null
    },
    type: "subscription",
    amount: 9.99,
    fee: 0.50,
    net: 9.49,
    status: "completed",
    description: "Monthly Premium Subscription",
    created_at: "2025-04-08T14:20:00Z",
    payment_method: "amex",
    payment_details: "**** 7777",
    related_id: "sub_98765"
  },
  {
    id: "tx_789012",
    user: {
      id: "u_778899",
      username: "MusicLover42",
      avatar: null
    },
    type: "gift_received",
    amount: 35.00,
    fee: 3.50,
    net: 31.50,
    status: "pending",
    description: "Gift earnings from freestyle 'Late Night Flow'",
    created_at: "2025-04-07T23:15:00Z",
    payment_method: null,
    payment_details: null,
    related_id: "fs_34567"
  }
];

// Mock data for revenue breakdown
const mockRevenueData: RevenueData = {
  total: 24899.50,
  gift_purchases: 12450.75,
  challenge_entries: 5680.25,
  subscriptions: 4218.50,
  other: 2550.00,
  timeframe: "current_month"
};

// Mock data for payout stats
const mockPayoutStats: PayoutStats = {
  total_paid: 18750.60,
  pending_payouts: 3540.25,
  average_payout: 285.75,
  users_paid: 66,
  next_scheduled: "2025-04-15T00:00:00Z",
  timeframe: "current_month"
};

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionDetailsOpen, setTransactionDetailsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({ 
    from: undefined,
    to: undefined
  });
  const [selectedSort, setSelectedSort] = useState("newest");
  
  // Filter transactions based on all filters
  const filteredTransactions = mockTransactions.filter((transaction) => {
    // Tab filter
    if (
      activeTab === "purchases" && !["gift_purchase", "subscription"].includes(transaction.type) ||
      activeTab === "earnings" && !["challenge_earnings", "gift_received"].includes(transaction.type) ||
      activeTab === "payouts" && transaction.type !== "payout" ||
      activeTab === "failed" && transaction.status !== "failed"
    ) {
      return false;
    }

    // Search filter
    if (
      searchQuery &&
      !transaction.user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (selectedStatus !== "all" && transaction.status !== selectedStatus) {
      return false;
    }

    // Type filter
    if (selectedType !== "all" && transaction.type !== selectedType) {
      return false;
    }

    // Date range filter - updated to handle DateRange type
    if (selectedDateRange?.from && selectedDateRange?.to) {
      const txDate = new Date(transaction.created_at);
      const fromDate = new Date(selectedDateRange.from);
      const toDate = new Date(selectedDateRange.to);
      
      // Set time to end of day for the "to" date for inclusive comparison
      toDate.setHours(23, 59, 59, 999);
      
      if (txDate < fromDate || txDate > toDate) {
        return false;
      }
    }

    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (selectedSort) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "amount_high":
        return Math.abs(b.amount) - Math.abs(a.amount);
      case "amount_low":
        return Math.abs(a.amount) - Math.abs(b.amount);
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedDateRange({ from: undefined, to: undefined });
    setSelectedSort("newest");
    setSearchQuery("");
  };
  
  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions & Payments</h1>
          <p className="text-muted-foreground">View and manage all platform transactions.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="earnings">User Earnings</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <TransactionFilters 
                selectedStatus={selectedStatus}
                selectedType={selectedType}
                selectedDateRange={selectedDateRange}
                selectedSort={selectedSort}
                onStatusChange={setSelectedStatus}
                onTypeChange={setSelectedType}
                onDateRangeChange={setSelectedDateRange}
                onSortChange={setSelectedSort}
                onReset={resetFilters}
              />
              <Button 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search by user, transaction ID, or description..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            <TransactionTable 
              transactions={sortedTransactions}
              filteredCount={sortedTransactions.length}
              totalCount={mockTransactions.length}
              onViewDetails={handleViewTransactionDetails}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RevenueOverview data={mockRevenueData} />
              <PayoutStatistics data={mockPayoutStats} />
              <ProcessingStatus />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TransactionDetails
        transaction={selectedTransaction}
        open={transactionDetailsOpen}
        onOpenChange={setTransactionDetailsOpen}
      />
    </DashboardLayout>
  );
};

export default Transactions;
