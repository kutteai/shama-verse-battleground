
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Download,
  MoreHorizontal,
  DollarSign, 
  Calendar,
  Gift,
  PlusCircle,
  MinusCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  CalendarDays,
  RefreshCw,
  User,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Tag,
  AlertCircle,
  Music
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from "date-fns";

import { toast } from "sonner";

// Mock data for transactions
const mockTransactions = [
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
const mockRevenueData = {
  total: 24899.50,
  gift_purchases: 12450.75,
  challenge_entries: 5680.25,
  subscriptions: 4218.50,
  other: 2550.00,
  timeframe: "current_month"
};

// Mock data for payout stats
const mockPayoutStats = {
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
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDetailsOpen, setTransactionDetailsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState({ from: null, to: null });
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

    // Date range filter
    if (selectedDateRange.from && selectedDateRange.to) {
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

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "gift_purchase":
        return <Gift className="h-5 w-5 text-purple-500" />;
      case "challenge_entry":
        return <PlusCircle className="h-5 w-5 text-blue-500" />;
      case "payout":
        return <MinusCircle className="h-5 w-5 text-red-500" />;
      case "challenge_earnings":
        return <PlusCircle className="h-5 w-5 text-green-500" />;
      case "gift_received":
        return <Gift className="h-5 w-5 text-green-500" />;
      case "subscription":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAmountWithDirection = (transaction) => {
    const amount = formatCurrency(Math.abs(transaction.amount));
    return transaction.amount >= 0 ? (
      <div className="flex items-center">
        <ArrowDownLeft size={16} className="mr-1 text-green-600" />
        <span>{amount}</span>
      </div>
    ) : (
      <div className="flex items-center">
        <ArrowUpRight size={16} className="mr-1 text-red-600" />
        <span>{amount}</span>
      </div>
    );
  };

  const resetFilters = () => {
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedDateRange({ from: null, to: null });
    setSelectedSort("newest");
    setSearchQuery("");
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
              <Button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filters
              </Button>
              <Button 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          {isFiltersOpen && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Transaction Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Transaction Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="gift_purchase">Gift Purchase</SelectItem>
                        <SelectItem value="challenge_entry">Challenge Entry</SelectItem>
                        <SelectItem value="payout">Payout</SelectItem>
                        <SelectItem value="challenge_earnings">Challenge Earnings</SelectItem>
                        <SelectItem value="gift_received">Gift Received</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <DateRangePicker 
                      className="mt-1"
                      value={selectedDateRange}
                      onValueChange={setSelectedDateRange}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Sort By</label>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="amount_high">Amount (High to Low)</SelectItem>
                        <SelectItem value="amount_low">Amount (Low to High)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                  <Button onClick={() => setIsFiltersOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Transaction</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.length > 0 ? (
                      sortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="group">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-muted rounded-full">
                                {getTypeIcon(transaction.type)}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {transaction.id}
                                </div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  {transaction.type.replace(/_/g, " ")}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={transaction.user.avatar} />
                                <AvatarFallback>{transaction.user.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {transaction.user.username}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {transaction.user.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate" title={transaction.description}>
                              {transaction.description}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {getAmountWithDirection(transaction)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(transaction.fee)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(transaction.net)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            <div className="whitespace-nowrap">
                              {formatDate(transaction.created_at)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setTransactionDetailsOpen(true);
                              }}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <DollarSign size={36} className="mb-2" />
                            <p>No transactions found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {sortedTransactions.length} of {mockTransactions.length} transactions
                </div>
                <Button variant="outline" size="sm" disabled={sortedTransactions.length === 0}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Transactions
                </Button>
              </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                    Revenue Overview
                  </CardTitle>
                  <CardDescription>Current month revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">
                    {formatCurrency(mockRevenueData.total)}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Gift className="h-4 w-4 mr-2 text-purple-500" />
                        <span>Gift Purchases</span>
                      </div>
                      <div>
                        {formatCurrency(mockRevenueData.gift_purchases)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <PlusCircle className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Challenge Entries</span>
                      </div>
                      <div>
                        {formatCurrency(mockRevenueData.challenge_entries)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Subscriptions</span>
                      </div>
                      <div>
                        {formatCurrency(mockRevenueData.subscriptions)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Other Revenue</span>
                      </div>
                      <div>
                        {formatCurrency(mockRevenueData.other)}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Select defaultValue={mockRevenueData.timeframe}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current_month">Current Month</SelectItem>
                      <SelectItem value="previous_month">Previous Month</SelectItem>
                      <SelectItem value="year_to_date">Year to Date</SelectItem>
                      <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MinusCircle className="h-5 w-5 mr-2 text-red-500" />
                    Payout Statistics
                  </CardTitle>
                  <CardDescription>Current month payout data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total Paid Out</div>
                      <div className="text-3xl font-bold">{formatCurrency(mockPayoutStats.total_paid)}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Pending Payouts</div>
                        <div className="text-xl font-bold">{formatCurrency(mockPayoutStats.pending_payouts)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Average Payout</div>
                        <div className="text-xl font-bold">{formatCurrency(mockPayoutStats.average_payout)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Users Paid</div>
                        <div className="text-xl font-bold">{mockPayoutStats.users_paid}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Next Scheduled</div>
                        <div className="text-sm font-medium">{formatDate(mockPayoutStats.next_scheduled)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Select defaultValue={mockPayoutStats.timeframe}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current_month">Current Month</SelectItem>
                      <SelectItem value="previous_month">Previous Month</SelectItem>
                      <SelectItem value="year_to_date">Year to Date</SelectItem>
                      <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm">Schedule Payouts</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                    Stripe Dashboard
                  </CardTitle>
                  <CardDescription>Payment processing status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">Connected and Active</div>
                        <div className="text-xs text-muted-foreground">Last synced: 5 minutes ago</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Processing Success Rate</div>
                        <div className="font-medium">98.2%</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Failed Transactions (24h)</div>
                        <div className="font-medium">3</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm">Average Processing Time</div>
                        <div className="font-medium">1.2s</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-center">
                  <Button className="w-full" variant="outline">
                    Open Stripe Dashboard
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={transactionDetailsOpen} onOpenChange={setTransactionDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View complete transaction information
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction ID:</span>
                  <span className="font-medium">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span>{formatDate(selectedTransaction.created_at)}</span>
                </div>
              </div>
              
              <div className="border-t border-b py-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedTransaction.user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedTransaction.user.username}</div>
                    <div className="text-sm text-muted-foreground">{selectedTransaction.user.id}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => {
                      toast.info(`Viewing user ${selectedTransaction.user.username}`);
                      setTransactionDetailsOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-1" />
                    View User
                  </Button>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Transaction Type:</div>
                  <div className="flex items-center">
                    {getTypeIcon(selectedTransaction.type)}
                    <span className="ml-2 capitalize">{selectedTransaction.type.replace(/_/g, " ")}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Description:</div>
                  <div>{selectedTransaction.description}</div>
                </div>
                
                {selectedTransaction.related_id && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Related Item:</div>
                    <div className="flex items-center">
                      {selectedTransaction.related_id.startsWith("ch_") && <Tag size={14} className="mr-1" />}
                      {selectedTransaction.related_id.startsWith("fs_") && <Music size={14} className="mr-1" />}
                      {selectedTransaction.related_id.startsWith("gift_") && <Gift size={14} className="mr-1" />}
                      {selectedTransaction.related_id.startsWith("sub_") && <Clock size={14} className="mr-1" />}
                      {selectedTransaction.related_id.startsWith("po_") && <CreditCard size={14} className="mr-1" />}
                      <span>{selectedTransaction.related_id}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="text-sm font-medium mb-2">Financial Details</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Amount:</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(Math.abs(selectedTransaction.amount))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Platform Fee:</div>
                    <div className="text-lg">
                      {formatCurrency(selectedTransaction.fee)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Net Amount:</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(Math.abs(selectedTransaction.net))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Payment Method:</div>
                    <div className="flex items-center">
                      {selectedTransaction.payment_method ? (
                        <>
                          <CreditCard size={14} className="mr-1" />
                          <span className="capitalize">{selectedTransaction.payment_method}</span>
                          {selectedTransaction.payment_details && (
                            <span className="ml-1 text-muted-foreground">
                              ({selectedTransaction.payment_details})
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedTransaction.error_message && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center mt-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">Transaction Failed</div>
                      <div className="text-xs text-red-600">{selectedTransaction.error_message}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t flex justify-between">
                <Button variant="outline">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Receipt
                </Button>
                
                {selectedTransaction.status === "failed" && (
                  <Button>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Transaction
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Transactions;
