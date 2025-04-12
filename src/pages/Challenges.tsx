
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  PauseCircle,
  Ban,
  Trash2,
  Gift,
  BarChart3,
  Clock,
  DollarSign,
  Calendar,
  CalendarDays,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

// Mock data for challenges
const mockChallenges = [
  {
    id: 1,
    title: "Summer Beat Battle",
    creator: { username: "MicDropKing", avatar: null },
    challenger: { username: "FlowMaster", avatar: null },
    type: "paid",
    amount: 150,
    status: "ongoing",
    votes: { creator: 256, challenger: 214 },
    giftTotal: 87,
    category: "battle",
    startDate: "2025-04-05T10:00:00Z",
    endDate: "2025-04-12T10:00:00Z",
    description: "Summer themed freestyle challenge with cash prize.",
    views: 4821,
  },
  {
    id: 2,
    title: "Lyrical Showcase",
    creator: { username: "BeatSlayer", avatar: null },
    challenger: { username: "VerseBeast", avatar: null },
    type: "free",
    amount: 0,
    status: "completed",
    votes: { creator: 432, challenger: 398 },
    giftTotal: 156,
    category: "showcase",
    startDate: "2025-03-28T14:00:00Z",
    endDate: "2025-04-04T14:00:00Z",
    description: "Show off your best bars and rhymes.",
    views: 7653,
  },
  {
    id: 3,
    title: "Rap Battle Championship",
    creator: { username: "RhymeQueen", avatar: null },
    challenger: { username: "LyricLegend", avatar: null },
    type: "paid",
    amount: 300,
    status: "pending",
    votes: { creator: 0, challenger: 0 },
    giftTotal: 0,
    category: "battle",
    startDate: "2025-04-15T18:00:00Z",
    endDate: "2025-04-22T18:00:00Z", 
    description: "Championship round of the monthly rap battle series.",
    views: 1250,
  },
  {
    id: 4,
    title: "Freestyle Friday",
    creator: { username: "CypherCrusher", avatar: null },
    challenger: { username: "SonicStyler", avatar: null },
    type: "free",
    amount: 0,
    status: "flagged",
    votes: { creator: 123, challenger: 187 },
    giftTotal: 24,
    category: "freestyle",
    startDate: "2025-04-02T20:00:00Z",
    endDate: "2025-04-09T20:00:00Z",
    description: "Weekly freestyle challenge, no theme restrictions.",
    views: 3560,
  },
  {
    id: 5,
    title: "16 Bar Challenge",
    creator: { username: "MicDropKing", avatar: null },
    challenger: { username: "RhymeQueen", avatar: null },
    type: "paid",
    amount: 75,
    status: "ongoing",
    votes: { creator: 164, challenger: 201 },
    giftTotal: 43,
    category: "technical",
    startDate: "2025-04-07T12:00:00Z",
    endDate: "2025-04-14T12:00:00Z",
    description: "Strict 16 bars only, judged on technical skill.",
    views: 2845,
  },
];

const Challenges = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Dialog states
  const [isPauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [isBanDialogOpen, setBanDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);

  // Action handlers
  const handleViewDetails = (challenge: any) => {
    toast({
      title: "View Challenge Details",
      description: `Viewing details for ${challenge.title}`,
    });
    // In a real app, you would navigate to a details page
    // navigate(`/challenges/${challenge.id}`);
  };

  const handleViewVotingAnalytics = (challenge: any) => {
    toast({
      title: "Voting Analytics",
      description: `Viewing voting analytics for ${challenge.title}`,
    });
    // In a real app, you would navigate to analytics page or show a modal
    // navigate(`/challenges/${challenge.id}/analytics`);
  };

  const handleViewGiftDonations = (challenge: any) => {
    toast({
      title: "Gift Donations",
      description: `Viewing gift donations for ${challenge.title} (${challenge.giftTotal} total)`,
    });
    // In a real app, you would navigate to donations page or show a modal
    // navigate(`/challenges/${challenge.id}/donations`);
  };

  const openPauseDialog = (challenge: any) => {
    setSelectedChallenge(challenge);
    setPauseDialogOpen(true);
  };

  const handlePauseChallenge = () => {
    if (!selectedChallenge) return;
    
    // In a real app, you would call an API to pause the challenge
    toast({
      title: "Challenge Paused",
      description: `${selectedChallenge.title} has been paused`,
    });
    
    // Update challenge status in UI
    const updatedChallenges = mockChallenges.map(challenge => 
      challenge.id === selectedChallenge.id 
        ? { ...challenge, status: "pending" }
        : challenge
    );
    
    // Close dialog
    setPauseDialogOpen(false);
  };

  const openBanDialog = (challenge: any) => {
    setSelectedChallenge(challenge);
    setBanDialogOpen(true);
  };

  const handleBanChallenge = () => {
    if (!selectedChallenge) return;
    
    // In a real app, you would call an API to ban the challenge
    toast({
      title: "Challenge Banned",
      description: `${selectedChallenge.title} has been banned`,
      variant: "destructive"
    });
    
    // Update challenge status in UI
    const updatedChallenges = mockChallenges.map(challenge => 
      challenge.id === selectedChallenge.id 
        ? { ...challenge, status: "flagged" }
        : challenge
    );
    
    // Close dialog
    setBanDialogOpen(false);
  };

  const openDeleteDialog = (challenge: any) => {
    setSelectedChallenge(challenge);
    setDeleteDialogOpen(true);
  };

  const handleDeleteChallenge = () => {
    if (!selectedChallenge) return;
    
    // In a real app, you would call an API to delete the challenge
    toast({
      title: "Challenge Deleted",
      description: `${selectedChallenge.title} has been deleted`,
      variant: "destructive"
    });
    
    // Close dialog
    setDeleteDialogOpen(false);
  };

  // Filter challenges based on all filters
  const filteredChallenges = mockChallenges.filter((challenge) => {
    // Tab filter
    if (
      activeTab === "ongoing" && challenge.status !== "ongoing" ||
      activeTab === "pending" && challenge.status !== "pending" ||
      activeTab === "completed" && challenge.status !== "completed" ||
      activeTab === "flagged" && challenge.status !== "flagged"
    ) {
      return false;
    }

    // Search filter
    if (
      searchQuery &&
      !challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !challenge.creator.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !challenge.challenger.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (selectedType !== "all" && challenge.type !== selectedType) {
      return false;
    }

    // Category filter
    if (selectedCategory !== "all" && challenge.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus !== "all" && challenge.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-green-500">Ongoing</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      case "flagged":
        return <Badge className="bg-red-500">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const challengeTypeColors = {
    paid: "text-green-500 bg-green-50",
    free: "text-blue-500 bg-blue-50",
  };

  const resetFilters = () => {
    setSelectedType("all");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges Management</h1>
          <p className="text-muted-foreground">Create and manage user challenges.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Challenges</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>

            <Button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>

          {isFiltersOpen && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="challenge-type">Challenge Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger id="challenge-type">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="challenge-category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="challenge-category">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="battle">Battle</SelectItem>
                        <SelectItem value="showcase">Showcase</SelectItem>
                        <SelectItem value="freestyle">Freestyle</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="challenge-status">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger id="challenge-status">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                    <Button className="flex-1" onClick={() => setIsFiltersOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search by title or username..." 
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
                      <TableHead className="w-[300px]">Challenge Details</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Votes</TableHead>
                      <TableHead className="hidden md:table-cell">Timeline</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChallenges.length > 0 ? (
                      filteredChallenges.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{challenge.title}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <span>By:</span> {challenge.creator.username} <span>vs.</span> {challenge.challenger.username}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye size={12} /> {challenge.views.toLocaleString()}
                                <Gift size={12} className="ml-2" /> {challenge.giftTotal}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${challengeTypeColors[challenge.type]}`}>
                              {challenge.type === "paid" && <DollarSign size={12} className="mr-1" />}
                              {challenge.type === "free" && <CheckCircle2 size={12} className="mr-1" />}
                              {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                              {challenge.type === "paid" && ` ($${challenge.amount})`}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(challenge.status)}</TableCell>
                          <TableCell>
                            <div className="space-y-2 w-32">
                              <div className="flex justify-between text-xs mb-1">
                                <span>{challenge.votes.creator}</span>
                                <span>{challenge.votes.challenger}</span>
                              </div>
                              <Progress 
                                value={challenge.votes.creator / (challenge.votes.creator + challenge.votes.challenger) * 100} 
                                className="h-2"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{challenge.creator.username}</span>
                                <span>{challenge.challenger.username}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <CalendarDays size={14} className="mr-1 text-muted-foreground" /> 
                                <span>Start: {formatDate(challenge.startDate)}</span>
                              </div>
                              <div className="flex items-center text-xs">
                                <Calendar size={14} className="mr-1 text-muted-foreground" /> 
                                <span>End: {formatDate(challenge.endDate)}</span>
                              </div>
                              <div className="flex items-center text-xs">
                                <Tag size={14} className="mr-1 text-muted-foreground" /> 
                                <span className="capitalize">{challenge.category}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => handleViewDetails(challenge)}
                                >
                                  <Eye size={16} />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => handleViewVotingAnalytics(challenge)}
                                >
                                  <BarChart3 size={16} />
                                  <span>Voting Analytics</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => handleViewGiftDonations(challenge)}
                                >
                                  <Gift size={16} />
                                  <span>Gift Donations</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {challenge.status === "ongoing" && (
                                  <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer text-yellow-500"
                                    onClick={() => openPauseDialog(challenge)}
                                  >
                                    <PauseCircle size={16} />
                                    <span>Pause Challenge</span>
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer text-red-500"
                                  onClick={() => openBanDialog(challenge)}
                                >
                                  <Ban size={16} />
                                  <span>Ban Challenge</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer text-red-700"
                                  onClick={() => openDeleteDialog(challenge)}
                                >
                                  <Trash2 size={16} />
                                  <span>Delete Challenge</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <XCircle size={36} className="mb-2" />
                            <p>No challenges found</p>
                            <p className="text-sm">Try adjusting your filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="p-5">
              <CardTitle className="mb-4">Challenge Statistics</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">Total Challenges</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-4xl font-bold">{mockChallenges.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">Active Challenges</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-4xl font-bold">
                      {mockChallenges.filter(c => c.status === "ongoing").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">Total Prize Pool</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-4xl font-bold">
                      ${mockChallenges.reduce((sum, c) => sum + c.amount, 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pause Challenge Dialog */}
      <AlertDialog open={isPauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pause Challenge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to pause this challenge? 
              {selectedChallenge && (
                <span className="font-medium block mt-2">
                  "{selectedChallenge.title}"
                </span>
              )}
              This will temporarily suspend voting and participation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePauseChallenge}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Pause Challenge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban Challenge Dialog */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban Challenge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to ban this challenge?
              {selectedChallenge && (
                <span className="font-medium block mt-2">
                  "{selectedChallenge.title}"
                </span>
              )}
              This will flag it as inappropriate and hide it from public view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanChallenge}
              className="bg-red-500 hover:bg-red-600"
            >
              Ban Challenge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Challenge Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Challenge</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this challenge?
              {selectedChallenge && (
                <span className="font-medium block mt-2">
                  "{selectedChallenge.title}"
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChallenge}
              className="bg-red-700 hover:bg-red-800"
            >
              Delete Challenge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Challenges;
