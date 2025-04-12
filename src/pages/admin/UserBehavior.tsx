
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserJourneyHeatmap from "@/components/analytics/UserJourneyHeatmap";
import UserBehaviorSegments from "@/components/analytics/UserBehaviorSegments";
import { userJourneyHeatmapData, userBehaviorSegmentsData } from "@/data/adminDashboardData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp,
  UserRound,
  Ghost,
  Heart,
  Gift,
  MessageSquare,
  Eye,
  Calendar,
  Clock,
  ArrowDownToLine,
  ArrowRight,
  ExternalLink,
  BarChart3,
  Users
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock user segments for detailed analysis
const userSegments = [
  {
    id: "segment_1",
    name: "Ghosts",
    description: "Users who browse but rarely engage",
    count: 1248,
    percentage: 16.5,
    behavior: "View only, no likes or comments",
    retention: "32% after 30 days",
    actionsNeeded: [
      "Targeted push notifications",
      "Simplified engagement options",
      "First-time commenter rewards"
    ]
  },
  {
    id: "segment_2",
    name: "Lurkers",
    description: "Users who watch videos regularly",
    count: 2571,
    percentage: 34.1,
    behavior: "Regular viewing, occasional likes",
    retention: "65% after 30 days",
    actionsNeeded: [
      "More content suggestions",
      "Social engagement prompts",
      "Like-to-follow conversion tactics"
    ]
  },
  {
    id: "segment_3",
    name: "Engagers",
    description: "Users who actively like and comment",
    count: 1825,
    percentage: 24.2,
    behavior: "Frequent likes, comments, shares",
    retention: "78% after 30 days",
    actionsNeeded: [
      "Community involvement initiatives",
      "User-generated content opportunities",
      "Badge progression system"
    ]
  },
  {
    id: "segment_4",
    name: "Superfans",
    description: "Users who gift regularly and support creators",
    count: 735,
    percentage: 9.7,
    behavior: "High gifting, frequent messages to creators",
    retention: "91% after 30 days",
    actionsNeeded: [
      "VIP perks and exclusive content",
      "Creator connection events",
      "Premium membership options"
    ]
  },
  {
    id: "segment_5",
    name: "Creators",
    description: "Users who upload content regularly",
    count: 1165,
    percentage: 15.5,
    behavior: "Regular uploads, high engagement rate",
    retention: "87% after 30 days",
    actionsNeeded: [
      "More creator tools and analytics",
      "Cross-promotion opportunities",
      "Revenue share incentives"
    ]
  }
];

// Mock user journeys
const userJourneys = [
  {
    id: "journey_1",
    user: {
      id: "u_112233",
      username: "MusicLover42",
      avatar: "https://i.pravatar.cc/150?img=33"
    },
    path: [
      { action: "signup", timestamp: "2025-04-01T10:23:45Z" },
      { action: "view_profile", username: "FlowMaster", timestamp: "2025-04-01T10:25:12Z" },
      { action: "view_video", contentId: "video_12345", timestamp: "2025-04-01T10:26:30Z" },
      { action: "like", contentId: "video_12345", timestamp: "2025-04-01T10:27:15Z" },
      { action: "follow", username: "FlowMaster", timestamp: "2025-04-01T10:27:42Z" },
      { action: "view_video", contentId: "video_23456", timestamp: "2025-04-01T10:30:10Z" },
      { action: "comment", contentId: "video_23456", timestamp: "2025-04-01T10:31:25Z" },
      { action: "gift", contentId: "video_23456", amount: 50, timestamp: "2025-04-01T10:32:18Z" }
    ],
    completedJourney: true,
    conversionTime: "8m 33s",
    segment: "Superfan"
  },
  {
    id: "journey_2",
    user: {
      id: "u_223344",
      username: "CasualBrowser",
      avatar: "https://i.pravatar.cc/150?img=22"
    },
    path: [
      { action: "signup", timestamp: "2025-04-02T15:42:10Z" },
      { action: "view_video", contentId: "video_34567", timestamp: "2025-04-02T15:44:22Z" },
      { action: "view_video", contentId: "video_45678", timestamp: "2025-04-02T15:48:05Z" },
      { action: "view_video", contentId: "video_56789", timestamp: "2025-04-02T15:52:40Z" },
      { action: "exit", timestamp: "2025-04-02T15:55:12Z" }
    ],
    completedJourney: false,
    conversionTime: "N/A",
    segment: "Ghost"
  }
];

const UserBehavior = () => {
  const [timeframe, setTimeframe] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [segmentDetailsOpen, setSegmentDetailsOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<any>(null);
  const [journeyDetailsOpen, setJourneyDetailsOpen] = useState(false);
  
  const handleViewSegmentDetails = (segment: any) => {
    setSelectedSegment(segment);
    setSegmentDetailsOpen(true);
  };
  
  const handleViewJourneyDetails = (journey: any) => {
    setSelectedJourney(journey);
    setJourneyDetailsOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };
  
  const handleCreateCampaign = () => {
    toast.success(`Campaign created for ${selectedSegment.name} segment`);
    setSegmentDetailsOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Behavior Analytics</h1>
            <p className="text-muted-foreground">Analyze user journeys and behavior patterns</p>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segments">User Segments</TabsTrigger>
            <TabsTrigger value="journeys">User Journeys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-blue-500" />
                    New Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">865</div>
                  <div className="flex items-center text-sm text-green-500">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    12.5% increase
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Engagement Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24.8%</div>
                  <div className="flex items-center text-sm text-green-500">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    3.2% increase
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Ghost className="h-4 w-4 text-gray-500" />
                    Churn Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">7.6%</div>
                  <div className="flex items-center text-sm text-green-500">
                    <ArrowDownToLine className="mr-1 h-4 w-4" />
                    2.1% decrease
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <UserJourneyHeatmap data={userJourneyHeatmapData} />
            
            <UserBehaviorSegments segments={userBehaviorSegmentsData} />
          </TabsContent>
          
          <TabsContent value="segments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Segments Analysis</CardTitle>
                <CardDescription>Group users by behavior patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userSegments.map((segment) => (
                    <div key={segment.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{segment.name}</h3>
                          <p className="text-sm text-muted-foreground">{segment.description}</p>
                        </div>
                        <Badge variant="outline">
                          {segment.count.toLocaleString()} users ({segment.percentage}%)
                        </Badge>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Segment Size</span>
                          <span>{segment.percentage}%</span>
                        </div>
                        <Progress value={segment.percentage} className="h-1.5" />
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <div className="text-sm space-y-1">
                          <div className="font-medium">Behavior:</div>
                          <div className="text-muted-foreground">{segment.behavior}</div>
                          
                          <div className="font-medium mt-2">Retention:</div>
                          <div className="text-muted-foreground">{segment.retention}</div>
                        </div>
                        
                        <Button 
                          variant="outline"
                          size="sm"
                          className="self-end"
                          onClick={() => handleViewSegmentDetails(segment)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="journeys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Journey Analysis</CardTitle>
                <CardDescription>Track how users navigate through the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userJourneys.map((journey) => (
                    <div key={journey.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={journey.user.avatar} alt={journey.user.username} />
                            <AvatarFallback>{journey.user.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{journey.user.username}</h3>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(journey.path[0].timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={journey.completedJourney ? "default" : "outline"}>
                          {journey.segment}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 flex items-center overflow-x-auto space-x-1 pb-2">
                        {journey.path.map((step, index) => (
                          <div key={index} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div className="bg-muted px-3 py-1 rounded text-xs whitespace-nowrap">
                                {step.action === "signup" && "Signup"}
                                {step.action === "view_profile" && `View ${step.username}`}
                                {step.action === "view_video" && "Watch Video"}
                                {step.action === "like" && "Like"}
                                {step.action === "follow" && `Follow ${step.username}`}
                                {step.action === "comment" && "Comment"}
                                {step.action === "gift" && `Gift $${step.amount}`}
                                {step.action === "exit" && "Exit"}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                                {new Date(step.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                            {index < journey.path.length - 1 && (
                              <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm">
                          <span className="font-medium">Conversion Time:</span>{" "}
                          <span className="text-muted-foreground">{journey.conversionTime}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewJourneyDetails(journey)}
                        >
                          Full Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Segment Details Dialog */}
      {selectedSegment && (
        <Dialog open={segmentDetailsOpen} onOpenChange={setSegmentDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Segment Details</DialogTitle>
              <DialogDescription>
                Detailed information about the {selectedSegment.name} user segment
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedSegment.name}</h2>
                  <p className="text-muted-foreground">{selectedSegment.description}</p>
                </div>
                <Badge className="text-base px-3 py-1">
                  {selectedSegment.percentage}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{selectedSegment.count.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{selectedSegment.retention}</div>
                    <div className="text-sm text-muted-foreground">Retention Rate</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Behavior Patterns</h3>
                <Card>
                  <CardContent className="pt-4 pb-2">
                    <div className="text-sm">{selectedSegment.behavior}</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Recommended Actions</h3>
                <Card>
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {selectedSegment.actionsNeeded.map((action, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button variant="outline" className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Export Analytics
                </Button>
                <Button className="flex-1" onClick={handleCreateCampaign}>
                  Create Targeted Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Journey Details Dialog */}
      {selectedJourney && (
        <Dialog open={journeyDetailsOpen} onOpenChange={setJourneyDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Journey Details</DialogTitle>
              <DialogDescription>
                Detailed path analysis for user {selectedJourney.user.username}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedJourney.user.avatar} alt={selectedJourney.user.username} />
                  <AvatarFallback>{selectedJourney.user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedJourney.user.username}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedJourney.completedJourney ? "default" : "outline"}>
                      {selectedJourney.segment}
                    </Badge>
                    <span className="text-sm text-muted-foreground">User ID: {selectedJourney.user.id}</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Journey Summary</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Started</div>
                    <div className="font-medium">{formatDate(selectedJourney.path[0].timestamp)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">{selectedJourney.conversionTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Steps</div>
                    <div className="font-medium">{selectedJourney.path.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Journey Path</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto p-1">
                  {selectedJourney.path.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-xs mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1 border rounded-md p-2">
                        <div className="flex justify-between">
                          <div className="font-medium capitalize">
                            {step.action.replace('_', ' ')}
                            {step.action === "view_profile" && `: ${step.username}`}
                            {step.action === "follow" && `: ${step.username}`}
                            {step.action === "gift" && `: $${step.amount}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(step.timestamp)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {step.action === "view_video" && `Content ID: ${step.contentId}`}
                          {step.action === "like" && `Content ID: ${step.contentId}`}
                          {step.action === "comment" && `Content ID: ${step.contentId}`}
                          {step.action === "gift" && `Content ID: ${step.contentId}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => setJourneyDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default UserBehavior;
