
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Flag, 
  AlertTriangle, 
  User, 
  MessageSquare, 
  Music, 
  MoreHorizontal, 
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  AlertOctagon,
  UserCheck,
  UserX,
  MessageSquareWarning,
  FileWarning,
  Filter
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock data for reports
const mockReports = [
  {
    id: 1,
    type: "content",
    content_type: "freestyle",
    content_id: "fs_12345",
    content_title: "Summer Vibes Freestyle",
    reporter: {
      id: "u_778899",
      username: "MusicLover42",
      avatar: null
    },
    reported_user: {
      id: "u_112233",
      username: "FlowMaster",
      avatar: null
    },
    reason: "inappropriate_content",
    description: "This freestyle contains explicit content that violates community guidelines.",
    status: "pending",
    created_at: "2025-04-11T14:23:00Z",
    updated_at: null
  },
  {
    id: 2,
    type: "user",
    content_type: "user",
    content_id: "u_445566",
    content_title: null,
    reporter: {
      id: "u_112233",
      username: "FlowMaster",
      avatar: null
    },
    reported_user: {
      id: "u_445566",
      username: "ToxicRhymer",
      avatar: null
    },
    reason: "harassment",
    description: "This user has been sending harassing messages and comments on my freestyles.",
    status: "investigating",
    created_at: "2025-04-10T09:45:00Z",
    updated_at: "2025-04-10T12:30:00Z"
  },
  {
    id: 3,
    type: "content",
    content_type: "challenge",
    content_id: "ch_78901",
    content_title: "Ultimate Rap Battle",
    reporter: {
      id: "u_334455",
      username: "BeatBoxKing",
      avatar: null
    },
    reported_user: {
      id: "u_667788",
      username: "LyricistPro",
      avatar: null
    },
    reason: "copyright",
    description: "This challenge contains copyrighted music and stolen beats.",
    status: "resolved",
    created_at: "2025-04-09T18:12:00Z",
    updated_at: "2025-04-11T10:20:00Z"
  },
  {
    id: 4,
    type: "content",
    content_type: "comment",
    content_id: "cm_24680",
    content_title: "Comment on 'Flow Like Water'",
    reporter: {
      id: "u_998877",
      username: "RhymeQueen",
      avatar: null
    },
    reported_user: {
      id: "u_445566",
      username: "ToxicRhymer",
      avatar: null
    },
    reason: "hate_speech",
    description: "This comment contains hate speech targeting specific groups.",
    status: "action_taken",
    created_at: "2025-04-08T22:05:00Z",
    updated_at: "2025-04-09T11:15:00Z"
  },
  {
    id: 5,
    type: "user",
    content_type: "user",
    content_id: "u_556677",
    content_title: null,
    reporter: {
      id: "u_112233",
      username: "FlowMaster",
      avatar: null
    },
    reported_user: {
      id: "u_556677",
      username: "SpamAccount",
      avatar: null
    },
    reason: "spam",
    description: "This account is spamming promotional links in comments and messages.",
    status: "pending",
    created_at: "2025-04-11T08:30:00Z",
    updated_at: null
  }
];

// Mock data for flagged content
const mockFlaggedContent = [
  {
    id: "fs_98765",
    type: "freestyle",
    title: "Late Night Flow",
    creator: {
      id: "u_112233",
      username: "FlowMaster",
      avatar: null
    },
    reason: "auto_nsfw",
    description: "Auto-flagged for potential NSFW content",
    created_at: "2025-04-11T20:15:00Z",
    status: "pending",
    confidence: 0.82
  },
  {
    id: "ch_45678",
    type: "challenge",
    title: "Explicit Bars Battle",
    creator: {
      id: "u_334455",
      username: "BeatBoxKing",
      avatar: null
    },
    reason: "auto_profanity",
    description: "Auto-flagged for excessive profanity",
    created_at: "2025-04-10T15:45:00Z",
    status: "pending",
    confidence: 0.75
  },
  {
    id: "cm_13579",
    type: "comment",
    title: "Comment on 'Street Vibes'",
    creator: {
      id: "u_445566",
      username: "ToxicRhymer",
      avatar: null
    },
    reason: "auto_hate_speech",
    description: "Auto-flagged for potential hate speech",
    created_at: "2025-04-09T12:30:00Z",
    status: "pending",
    confidence: 0.91
  }
];

// Mock data for moderation logs
const mockModerationLogs = [
  {
    id: 1,
    moderator: {
      id: "u_111111",
      username: "AdminUser",
      avatar: null
    },
    action: "remove_content",
    content_type: "freestyle",
    content_id: "fs_24680",
    content_title: "Controversial Flow",
    reason: "violates_guidelines",
    details: "Content removed for violating community guidelines regarding explicit content.",
    created_at: "2025-04-11T14:30:00Z"
  },
  {
    id: 2,
    moderator: {
      id: "u_111111",
      username: "AdminUser",
      avatar: null
    },
    action: "warn_user",
    content_type: "user",
    content_id: "u_445566",
    content_title: "ToxicRhymer",
    reason: "repeated_violations",
    details: "User warned for repeated violations of community guidelines.",
    created_at: "2025-04-10T11:20:00Z"
  },
  {
    id: 3,
    moderator: {
      id: "u_222222",
      username: "ModeratorJane",
      avatar: null
    },
    action: "ban_user",
    content_type: "user",
    content_id: "u_556677",
    content_title: "SpamAccount",
    reason: "spam_activity",
    details: "User banned for persistent spam activity after multiple warnings.",
    created_at: "2025-04-09T09:45:00Z"
  },
  {
    id: 4,
    moderator: {
      id: "u_222222",
      username: "ModeratorJane",
      avatar: null
    },
    action: "approve_content",
    content_type: "challenge",
    content_id: "ch_13579",
    content_title: "Battle of the Beats",
    reason: "false_positive",
    details: "Challenge reviewed and approved after being auto-flagged. No violations found.",
    created_at: "2025-04-08T16:15:00Z"
  }
];

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("reports");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [actionType, setActionType] = useState("no_action");
  
  // Filter reports based on search query
  const filteredReports = mockReports.filter((report) => 
    report.reported_user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (report.content_title && report.content_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    report.reporter.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFlagged = mockFlaggedContent.filter((content) => 
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to handle report action
  const handleReportAction = () => {
    if (!selectedReport) return;
    
    // Simulate API call
    setTimeout(() => {
      switch (actionType) {
        case "approve":
          toast.success(`Content approved and report dismissed`);
          break;
        case "remove":
          toast.success(`Content removed and reporter notified`);
          break;
        case "warn":
          toast.success(`Warning issued to ${selectedReport.reported_user.username}`);
          break;
        case "ban":
          toast.warning(`User ${selectedReport.reported_user.username} has been banned`);
          break;
        default:
          toast.info(`No action taken on report #${selectedReport.id}`);
      }
      
      setReportDetailsOpen(false);
      setResponseText("");
      setActionType("no_action");
    }, 1000);
  };
  
  // Helper functions for rendering
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending Review</Badge>;
      case "investigating":
        return <Badge className="bg-blue-500">Investigating</Badge>;
      case "action_taken":
        return <Badge className="bg-red-500">Action Taken</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getReasonBadge = (reason) => {
    switch (reason) {
      case "inappropriate_content":
        return <Badge className="bg-red-500">Inappropriate Content</Badge>;
      case "harassment":
        return <Badge className="bg-orange-500">Harassment</Badge>;
      case "hate_speech":
        return <Badge className="bg-red-700">Hate Speech</Badge>;
      case "copyright":
        return <Badge className="bg-blue-500">Copyright</Badge>;
      case "spam":
        return <Badge className="bg-yellow-500">Spam</Badge>;
      default:
        return <Badge variant="outline">{reason}</Badge>;
    }
  };
  
  const getTypeIcon = (type, content_type) => {
    if (type === "user") return <User className="h-5 w-5 text-blue-500" />;
    
    if (content_type === "freestyle") return <Music className="h-5 w-5 text-purple-500" />;
    if (content_type === "challenge") return <Flag className="h-5 w-5 text-orange-500" />;
    if (content_type === "comment") return <MessageSquare className="h-5 w-5 text-green-500" />;
    
    return <AlertTriangle className="h-5 w-5 text-red-500" />;
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Moderation</h1>
          <p className="text-muted-foreground">Review and handle user reports and flagged content.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="reports" className="flex items-center gap-1">
                <Flag size={16} />
                <span>User Reports</span>
              </TabsTrigger>
              <TabsTrigger value="flagged" className="flex items-center gap-1">
                <AlertOctagon size={16} />
                <span>Auto-Flagged</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-1">
                <FileWarning size={16} />
                <span>Moderation Logs</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search reports..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* User Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xl">User-Submitted Reports</CardTitle>
                <CardDescription>
                  Review and take action on content reported by users
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reported User/Content</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id} className="group">
                          <TableCell className="font-medium">#{report.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(report.type, report.content_type)}
                              <span className="capitalize">{report.content_type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={report.reported_user.avatar} />
                                <AvatarFallback>{report.reported_user.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-medium">{report.reported_user.username}</span>
                                {report.content_title && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                    {report.content_title}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={report.reporter.avatar} />
                                <AvatarFallback>{report.reporter.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{report.reporter.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getReasonBadge(report.reason)}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-sm">{formatDate(report.created_at)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report);
                                setReportDetailsOpen(true);
                              }}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Flag size={36} className="mb-2" />
                            <p>No reports found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredReports.length} of {mockReports.length} reports
                </div>
                <Button variant="outline" size="sm">
                  View Archive
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xl">Report Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Pending Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-3xl font-bold">
                        {mockReports.filter(r => r.status === "pending").length}
                      </div>
                      <p className="text-sm text-muted-foreground">Require attention</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Total Reports Today</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-3xl font-bold">
                        3
                      </div>
                      <p className="text-sm text-muted-foreground">Last 24 hours</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Most Reported Type</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xl font-bold">
                        Freestyle Content
                      </div>
                      <p className="text-sm text-muted-foreground">42% of reports</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Avg. Resolution Time</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-3xl font-bold">
                        2.4h
                      </div>
                      <p className="text-sm text-muted-foreground">Last 7 days</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Auto-Flagged Content Tab */}
          <TabsContent value="flagged" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xl">Auto-Flagged Content</CardTitle>
                <CardDescription>
                  Content automatically flagged by the system for potential violations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Content Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Flag Reason</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFlagged.length > 0 ? (
                      filteredFlagged.map((content) => (
                        <TableRow key={content.id}>
                          <TableCell className="font-medium">{content.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {content.type === "freestyle" && <Music className="h-5 w-5 text-purple-500" />}
                              {content.type === "challenge" && <Flag className="h-5 w-5 text-orange-500" />}
                              {content.type === "comment" && <MessageSquare className="h-5 w-5 text-green-500" />}
                              <span className="capitalize">{content.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{content.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={content.creator.avatar} />
                                <AvatarFallback>{content.creator.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{content.creator.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {content.reason === "auto_nsfw" && <Badge className="bg-red-500">NSFW Content</Badge>}
                            {content.reason === "auto_profanity" && <Badge className="bg-orange-500">Excessive Profanity</Badge>}
                            {content.reason === "auto_hate_speech" && <Badge className="bg-red-700">Hate Speech</Badge>}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${content.confidence > 0.8 ? 'bg-red-500' : 'bg-orange-500'}`}
                                  style={{ width: `${content.confidence * 100}%` }}
                                ></div>
                              </div>
                              <span>{Math.round(content.confidence * 100)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(content.created_at)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Eye size={16} />
                                  <span>View Content</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-green-600">
                                  <CheckCircle size={16} />
                                  <span>Approve</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-orange-500">
                                  <MessageSquareWarning size={16} />
                                  <span>Warn Creator</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-500">
                                  <XCircle size={16} />
                                  <span>Remove Content</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <AlertOctagon size={36} className="mb-2" />
                            <p>No flagged content found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredFlagged.length} of {mockFlaggedContent.length} flagged items
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Tune AI Sensitivity</Button>
                  <Button size="sm">Approve All</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Moderation Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xl">Moderation Activity Log</CardTitle>
                <CardDescription>
                  History of actions taken by moderators
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Moderator</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockModerationLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={log.moderator.avatar} />
                              <AvatarFallback>{log.moderator.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{log.moderator.username}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.action === "remove_content" && (
                            <Badge className="bg-red-500">Removed Content</Badge>
                          )}
                          {log.action === "warn_user" && (
                            <Badge className="bg-yellow-500">Warned User</Badge>
                          )}
                          {log.action === "ban_user" && (
                            <Badge className="bg-red-700">Banned User</Badge>
                          )}
                          {log.action === "approve_content" && (
                            <Badge className="bg-green-500">Approved Content</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {log.content_type === "user" ? (
                              <User size={16} className="text-blue-500" />
                            ) : log.content_type === "freestyle" ? (
                              <Music size={16} className="text-purple-500" />
                            ) : log.content_type === "challenge" ? (
                              <Flag size={16} className="text-orange-500" />
                            ) : (
                              <MessageSquare size={16} className="text-green-500" />
                            )}
                            <span className="font-medium">
                              {log.content_title || log.content_id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{log.reason.replace(/_/g, " ")}</span>
                        </TableCell>
                        <TableCell>{formatDate(log.created_at)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-8">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing most recent moderation activity
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Export Logs</Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xl">Moderation Team Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Actions by Moderator</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <span>AdminUser</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">24 actions</div>
                            <div className="text-xs text-muted-foreground">Last 7 days</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <span>ModeratorJane</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">18 actions</div>
                            <div className="text-xs text-muted-foreground">Last 7 days</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Action Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Content Approved</span>
                          </div>
                          <span className="font-medium">48</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>Content Removed</span>
                          </div>
                          <span className="font-medium">23</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-yellow-500" />
                            <span>Warnings Issued</span>
                          </div>
                          <span className="font-medium">15</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <UserX className="h-4 w-4 text-red-700" />
                            <span>Users Banned</span>
                          </div>
                          <span className="font-medium">5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Report Details Dialog */}
      <Dialog open={reportDetailsOpen} onOpenChange={setReportDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report #{selectedReport?.id}</DialogTitle>
            <DialogDescription>
              Review details and take action
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Reported By</h3>
                  <div className="p-3 border rounded-md flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedReport.reporter.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedReport.reporter.username}</p>
                      <p className="text-sm text-muted-foreground">User ID: {selectedReport.reporter.id}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Reported User/Content</h3>
                  <div className="p-3 border rounded-md flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedReport.reported_user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedReport.reported_user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedReport.content_type === "user" ? 
                          `User ID: ${selectedReport.content_id}` : 
                          `${selectedReport.content_type} ID: ${selectedReport.content_id}`}
                      </p>
                      {selectedReport.content_title && (
                        <p className="text-sm font-medium">{selectedReport.content_title}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Report Details</h3>
                <div className="p-3 border rounded-md space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="ml-1 capitalize">{selectedReport.content_type}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Reason:</span>
                      <span className="ml-1 capitalize">{selectedReport.reason.replace(/_/g, " ")}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Reported:</span>
                      <span className="ml-1">{formatDate(selectedReport.created_at)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="ml-1">{selectedReport.status}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground block">Description:</span>
                    <p className="mt-1 p-2 bg-muted rounded-md">{selectedReport.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Take Action</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Select value={actionType} onValueChange={setActionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_action">No Action Required</SelectItem>
                      <SelectItem value="approve">Approve Content</SelectItem>
                      <SelectItem value="remove">Remove Content</SelectItem>
                      <SelectItem value="warn">Warn User</SelectItem>
                      <SelectItem value="ban">Ban User</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="space-y-2">
                    <Label htmlFor="response">Notes/Response</Label>
                    <Textarea 
                      id="response" 
                      placeholder="Enter optional notes or response to reporter..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDetailsOpen(false)}>Cancel</Button>
            <Button onClick={handleReportAction}>Submit Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Reports;
