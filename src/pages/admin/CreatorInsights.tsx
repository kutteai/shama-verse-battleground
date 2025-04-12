
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorPerformance from "@/components/creators/CreatorPerformance";
import { creatorPerformanceData } from "@/data/adminDashboardData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Search,
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Gift,
  DollarSign,
  CheckCircle2,
  Clock,
  Filter,
  CalendarDays,
  Crown,
  Star,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock top creators data
const topCreators = [
  {
    id: "creator_1",
    name: "Alex Johnson",
    username: "MicDropKing",
    avatar: "https://i.pravatar.cc/150?img=12",
    earnings: 12450,
    followers: 15420,
    engagement: 8.7,
    growth: 12,
    verified: true,
    badges: ["OG", "Rising Star"]
  },
  {
    id: "creator_2",
    name: "Jamie Smith",
    username: "FlowMaster",
    avatar: "https://i.pravatar.cc/150?img=11",
    earnings: 10280,
    followers: 12890,
    engagement: 9.2,
    growth: 8,
    verified: true,
    badges: ["Top Earner"]
  },
  {
    id: "creator_3",
    name: "Taylor Richards",
    username: "BeatSlayer",
    avatar: "https://i.pravatar.cc/150?img=10",
    earnings: 8945,
    followers: 11250,
    engagement: 7.6,
    growth: 15,
    verified: false,
    badges: ["Rising Star"]
  },
  {
    id: "creator_4",
    name: "Jordan Lee",
    username: "RhymeQueen",
    avatar: "https://i.pravatar.cc/150?img=9",
    earnings: 7650,
    followers: 10780,
    engagement: 8.9,
    growth: -2,
    verified: true,
    badges: []
  },
  {
    id: "creator_5",
    name: "Casey Morgan",
    username: "LyricLegend",
    avatar: "https://i.pravatar.cc/150?img=8",
    earnings: 6430,
    followers: 7840,
    engagement: 7.2,
    growth: 5,
    verified: false,
    badges: []
  }
];

// Mock creator content data
const creatorContent = [
  {
    id: "content_1",
    title: "Summer Beat Battle",
    type: "challenge",
    views: 24680,
    likes: 1850,
    gifts: 125,
    comments: 456,
    uploadDate: "2025-04-05T14:30:00Z"
  },
  {
    id: "content_2",
    title: "90s Hip-Hop Tribute",
    type: "freestyle",
    views: 15720,
    likes: 1240,
    gifts: 86,
    comments: 312,
    uploadDate: "2025-04-02T10:45:00Z"
  },
  {
    id: "content_3",
    title: "Lyrical Showcase",
    type: "challenge",
    views: 12450,
    likes: 980,
    gifts: 72,
    comments: 245,
    uploadDate: "2025-03-28T16:20:00Z"
  },
  {
    id: "content_4",
    title: "Freestyle Friday Vol. 3",
    type: "freestyle",
    views: 9840,
    likes: 720,
    gifts: 58,
    comments: 186,
    uploadDate: "2025-03-25T12:10:00Z"
  }
];

const CreatorInsights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [creatorDetailsOpen, setCreatorDetailsOpen] = useState(false);
  const [sortBy, setSortBy] = useState("earnings");
  const [timeframe, setTimeframe] = useState("month");
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  
  // Filter creators based on search query
  const filteredCreators = topCreators.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort creators based on selected criteria
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case "earnings":
        return b.earnings - a.earnings;
      case "followers":
        return b.followers - a.followers;
      case "engagement":
        return b.engagement - a.engagement;
      case "growth":
        return b.growth - a.growth;
      default:
        return 0;
    }
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const handleViewCreatorDetails = (creator: any) => {
    setSelectedCreator(creator);
    setCreatorDetailsOpen(true);
  };
  
  const handleVerifyCreator = (creator: any) => {
    setSelectedCreator(creator);
    setVerificationDialogOpen(true);
  };

  const confirmVerification = () => {
    toast.success(`${selectedCreator.username} has been verified`);
    setVerificationDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creator Insights</h1>
          <p className="text-muted-foreground">Track creator performance, earnings, and engagement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">256</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                12% increase this month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Average Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$856</div>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                8.5% increase this month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Verified Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42</div>
              <div className="flex items-center text-sm text-muted-foreground">
                16.4% of total creators
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="top-creators" className="space-y-4">
          <TabsList>
            <TabsTrigger value="top-creators">Top Creators</TabsTrigger>
            <TabsTrigger value="creator-detail">Creator Detail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="top-creators" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Top Performing Creators</CardTitle>
                <CardDescription>By earnings, engagement, and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input 
                      placeholder="Search creators..." 
                      className="pl-10" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[160px]">
                          <div className="flex items-center gap-2">
                            <Filter size={16} />
                            <SelectValue placeholder="Sort by" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="earnings">Earnings</SelectItem>
                          <SelectItem value="followers">Followers</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="growth">Growth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="w-[160px]">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            <SelectValue placeholder="Timeframe" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead className="hidden md:table-cell">Followers</TableHead>
                      <TableHead className="hidden md:table-cell">Engagement</TableHead>
                      <TableHead className="hidden sm:table-cell">Growth</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCreators.map((creator) => (
                      <TableRow key={creator.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {creator.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-white">
                                  <CheckCircle2 className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{creator.name}</div>
                              <div className="text-sm text-muted-foreground">@{creator.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${creator.earnings.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {creator.followers.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <span className="mr-2">{creator.engagement}%</span>
                            <Progress value={creator.engagement * 10} className="h-1 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className={`flex items-center ${creator.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {creator.growth >= 0 ? (
                              <ArrowUpRight className="mr-1 h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="mr-1 h-4 w-4" />
                            )}
                            <span>{Math.abs(creator.growth)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!creator.verified && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-blue-500"
                                onClick={() => handleVerifyCreator(creator)}
                              >
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                <span>Verify</span>
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewCreatorDetails(creator)}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredCreators.length === 0 && (
                  <div className="py-6 text-center text-muted-foreground">
                    No creators found matching your search criteria.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredCreators.length} of {topCreators.length} creators
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
          </TabsContent>
          
          <TabsContent value="creator-detail">
            <CreatorPerformance creator={creatorPerformanceData} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Creator Details Dialog */}
      {selectedCreator && (
        <Dialog open={creatorDetailsOpen} onOpenChange={setCreatorDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Creator Details</DialogTitle>
              <DialogDescription>
                Detailed information and performance metrics.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-2">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCreator.avatar} alt={selectedCreator.name} />
                  <AvatarFallback>{selectedCreator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedCreator.name}</h2>
                    {selectedCreator.verified && (
                      <Badge className="bg-blue-500">Verified</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">@{selectedCreator.username}</div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedCreator.badges.map((badge: string, index: number) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {badge === "OG" && <Crown className="h-3 w-3" />}
                        {badge === "Rising Star" && <Star className="h-3 w-3" />}
                        {badge === "Top Earner" && <DollarSign className="h-3 w-3" />}
                        <span>{badge}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-4 sm:col-span-2 p-3 rounded-md bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Total Earnings</span>
                  </div>
                  <span className="font-bold">${selectedCreator.earnings.toLocaleString()}</span>
                </div>
                <div className="col-span-4 sm:col-span-2 p-3 rounded-md bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Followers</span>
                  </div>
                  <span className="font-bold">{selectedCreator.followers.toLocaleString()}</span>
                </div>
                <div className="col-span-4 sm:col-span-2 p-3 rounded-md bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Engagement Rate</span>
                  </div>
                  <span className="font-bold">{selectedCreator.engagement}%</span>
                </div>
                <div className="col-span-4 sm:col-span-2 p-3 rounded-md bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Challenges Won</span>
                  </div>
                  <span className="font-bold">24</span>
                </div>
                <div className="col-span-4 sm:col-span-2 p-3 rounded-md bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Gifts Received</span>
                  </div>
                  <span className="font-bold">856</span>
                </div>
                <div className="col-span-4 sm:col-span-2 p-3 rounded-md bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Avg. View Time</span>
                  </div>
                  <span className="font-bold">1:24</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-1">Recent Content</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                  {creatorContent.map((content) => (
                    <div key={content.id} className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{content.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs mr-2 capitalize">
                              {content.type}
                            </Badge>
                            <CalendarDays className="h-3 w-3 mr-1" />
                            <span>{formatDate(content.uploadDate)}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        <div className="flex flex-col items-center text-xs">
                          <span className="font-medium">{content.views.toLocaleString()}</span>
                          <span className="text-muted-foreground">Views</span>
                        </div>
                        <div className="flex flex-col items-center text-xs">
                          <span className="font-medium">{content.likes.toLocaleString()}</span>
                          <span className="text-muted-foreground">Likes</span>
                        </div>
                        <div className="flex flex-col items-center text-xs">
                          <span className="font-medium">{content.gifts}</span>
                          <span className="text-muted-foreground">Gifts</span>
                        </div>
                        <div className="flex flex-col items-center text-xs">
                          <span className="font-medium">{content.comments}</span>
                          <span className="text-muted-foreground">Comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreatorDetailsOpen(false)}>
                Close
              </Button>
              <Button>View Full Analytics</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Creator Verification Dialog */}
      {selectedCreator && (
        <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Verify Creator</DialogTitle>
              <DialogDescription>
                Add verified status to this creator's account.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedCreator.avatar} alt={selectedCreator.name} />
                  <AvatarFallback>{selectedCreator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedCreator.name}</div>
                  <div className="text-sm text-muted-foreground">@{selectedCreator.username}</div>
                </div>
              </div>
              
              <div className="mt-4 p-4 rounded-md bg-blue-50 text-blue-800 text-sm">
                <p className="mb-2 font-medium">Verifying this creator will:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Add a verification badge to their profile</li>
                  <li>Highlight their content in discovery</li>
                  <li>Grant access to exclusive creator features</li>
                  <li>Improve visibility in search results</li>
                </ul>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setVerificationDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={confirmVerification}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Verify Creator
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default CreatorInsights;
