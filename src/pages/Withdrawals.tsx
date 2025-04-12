
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  DollarSign, 
  Check,
  X,
  Search,
  Filter,
  Clock,
  Calendar,
  User,
  ArrowDownToLine,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";

// Mock withdrawal requests data
const withdrawalRequests = [
  {
    id: "wr_001",
    user: {
      id: "usr_123",
      name: "Alex Johnson",
      username: "MicDropKing",
      email: "micdropking@example.com",
      avatar: "https://i.pravatar.cc/150?img=12"
    },
    amount: 250.00,
    requestDate: "2025-04-10T14:30:00Z",
    paymentMethod: "PayPal",
    accountDetails: "micdropking@example.com",
    status: "pending",
    balance: 425.75
  },
  {
    id: "wr_002",
    user: {
      id: "usr_124",
      name: "Jamie Smith",
      username: "FlowMaster",
      email: "flowmaster@example.com",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    amount: 120.50,
    requestDate: "2025-04-09T10:15:00Z",
    paymentMethod: "Bank Transfer",
    accountDetails: "XXXX-XXXX-XXXX-4832",
    status: "pending",
    balance: 180.25
  },
  {
    id: "wr_003",
    user: {
      id: "usr_125",
      name: "Taylor Richards",
      username: "BeatSlayer",
      email: "beatslayer@example.com",
      avatar: "https://i.pravatar.cc/150?img=10"
    },
    amount: 500.00,
    requestDate: "2025-04-08T16:45:00Z",
    paymentMethod: "PayPal",
    accountDetails: "beatslayer@example.com",
    status: "approved",
    balance: 120.00
  },
  {
    id: "wr_004",
    user: {
      id: "usr_126",
      name: "Jordan Lee",
      username: "RhymeQueen",
      email: "rhymequeen@example.com",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    amount: 75.25,
    requestDate: "2025-04-07T09:30:00Z",
    paymentMethod: "Venmo",
    accountDetails: "@RhymeQueen",
    status: "rejected",
    rejectionReason: "Insufficient account verification",
    balance: 75.25
  },
  {
    id: "wr_005",
    user: {
      id: "usr_127",
      name: "Casey Morgan",
      username: "LyricLegend",
      email: "lyriclegend@example.com",
      avatar: "https://i.pravatar.cc/150?img=8"
    },
    amount: 320.00,
    requestDate: "2025-04-11T11:20:00Z",
    paymentMethod: "Bank Transfer",
    accountDetails: "XXXX-XXXX-XXXX-6741",
    status: "pending",
    balance: 320.00
  },
];

// Mock transactions history
const transactionHistory = [
  {
    id: "tx_001",
    user: "MicDropKing",
    type: "withdrawal",
    amount: 150.00,
    date: "2025-04-01T14:30:00Z",
    status: "completed"
  },
  {
    id: "tx_002",
    user: "FlowMaster",
    type: "withdrawal",
    amount: 200.00,
    date: "2025-03-28T10:15:00Z",
    status: "completed"
  },
  {
    id: "tx_003",
    user: "RhymeQueen",
    type: "withdrawal",
    amount: 100.00,
    date: "2025-03-25T16:45:00Z",
    status: "completed"
  },
  {
    id: "tx_004",
    user: "BeatSlayer",
    type: "withdrawal",
    amount: 350.00,
    date: "2025-03-20T09:30:00Z",
    status: "completed"
  },
];

const Withdrawals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);

  // Filter withdrawal requests
  const filteredRequests = withdrawalRequests.filter(request => {
    // Status filter
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchQuery && !request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !request.user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !request.user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleApproveRequest = (request: any) => {
    toast.success(`Withdrawal request of $${request.amount} for ${request.user.username} has been approved`);
    // In a real app, we would update the server here
  };
  
  const openRejectDialog = (request: any) => {
    setSelectedRequest(request);
    setRejectReason("");
    setRejectDialogOpen(true);
  };
  
  const handleRejectRequest = () => {
    if (!rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    toast.success(`Withdrawal request of $${selectedRequest.amount} for ${selectedRequest.user.username} has been rejected`);
    setRejectDialogOpen(false);
    // In a real app, we would update the server here
  };
  
  const openViewDetailsDialog = (request: any) => {
    setSelectedRequest(request);
    setViewDetailsDialogOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Withdrawal Requests</h1>
          <p className="text-muted-foreground">Review and manage user withdrawal requests</p>
        </div>
        
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>Review and process user withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input 
                      placeholder="Search by name, username, or email" 
                      className="pl-10" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <div className="flex items-center gap-2">
                          <Filter size={16} />
                          <SelectValue placeholder="Filter by status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Request Date</TableHead>
                        <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={request.user.avatar} alt={request.user.name} />
                                  <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{request.user.name}</div>
                                  <div className="text-sm text-muted-foreground">@{request.user.username}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              ${request.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(request.requestDate)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {request.paymentMethod}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(request.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => openViewDetailsDialog(request)}
                                >
                                  View
                                </Button>
                                
                                {request.status === "pending" && (
                                  <>
                                    <Button 
                                      variant="default" 
                                      size="sm" 
                                      onClick={() => handleApproveRequest(request)}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-500" 
                                      onClick={() => openRejectDialog(request)}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No withdrawal requests found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredRequests.length} of {withdrawalRequests.length} requests
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {withdrawalRequests.filter(r => r.status === "pending").length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: ${withdrawalRequests.filter(r => r.status === "pending")
                      .reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Average Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${(withdrawalRequests.reduce((sum, r) => sum + r.amount, 0) / withdrawalRequests.length).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on last 30 days
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Processing Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    6.2 hours
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Average processing time
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Past withdrawal transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionHistory.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.user}</TableCell>
                        <TableCell className="capitalize">{transaction.type}</TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Reject Request Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this withdrawal request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedRequest.user.avatar} alt={selectedRequest.user.name} />
                    <AvatarFallback>{selectedRequest.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedRequest.user.name}</div>
                    <div className="text-sm text-muted-foreground">@{selectedRequest.user.username}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${selectedRequest.amount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{selectedRequest.paymentMethod}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Rejection Reason</Label>
                <Textarea 
                  id="rejection-reason" 
                  placeholder="Please provide a reason for rejection" 
                  value={rejectReason} 
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectRequest}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Details Dialog */}
      <Dialog open={viewDetailsDialogOpen} onOpenChange={setViewDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Withdrawal Request Details</DialogTitle>
            <DialogDescription>
              Complete details about this withdrawal request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-5 py-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedRequest.user.avatar} alt={selectedRequest.user.name} />
                  <AvatarFallback>{selectedRequest.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-lg">{selectedRequest.user.name}</div>
                  <div className="text-sm text-muted-foreground">@{selectedRequest.user.username}</div>
                  <div className="text-sm mt-1 flex items-center">
                    <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <a href={`mailto:${selectedRequest.user.email}`} className="text-blue-600 hover:underline">
                      {selectedRequest.user.email}
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Request ID</div>
                  <div className="font-medium">{selectedRequest.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div>{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium text-lg">${selectedRequest.amount.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Current Balance</div>
                  <div className="font-medium">${selectedRequest.balance.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Request Date</div>
                  <div className="font-medium">{formatDate(selectedRequest.requestDate)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="font-medium">{selectedRequest.paymentMethod}</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Account Details</div>
                <div className="font-medium p-2 bg-muted rounded-md">
                  {selectedRequest.accountDetails}
                </div>
              </div>
              
              {selectedRequest.status === "rejected" && selectedRequest.rejectionReason && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Rejection Reason</div>
                  <div className="font-medium p-2 bg-red-50 border border-red-200 text-red-800 rounded-md">
                    {selectedRequest.rejectionReason}
                  </div>
                </div>
              )}
              
              {selectedRequest.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      handleApproveRequest(selectedRequest);
                      setViewDetailsDialogOpen(false);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Approve Request
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-red-500" 
                    onClick={() => {
                      setViewDetailsDialogOpen(false);
                      setTimeout(() => openRejectDialog(selectedRequest), 100);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Withdrawals;
