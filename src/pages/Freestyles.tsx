
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
  Music, 
  Flame, 
  Heart,
  MessageSquare,
  Eye,
  MoreHorizontal,
  Clock,
  Play,
  Filter,
  Calendar,
  Gift,
  BarChart3,
  CheckCircle,
  XCircle,
  Flag,
  ThumbsUp,
  Share2,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock data for freestyle content
const mockFreestyles = [
  {
    id: "fs_12345",
    title: "Summer Vibes Freestyle",
    creator: {
      id: "u_112233",
      username: "FlowMaster",
      avatar: null
    },
    duration: 92, // seconds
    views: 12453,
    likes: 824,
    comments: 149,
    shares: 67,
    gifts: 32,
    status: "active",
    nsfw_score: 0.05,
    created_at: "2025-04-10T14:30:00Z",
    featured: true,
    tags: ["summer", "vibey", "chill"],
    thumbnail: "https://images.unsplash.com/photo-1530793740383-1b90d971cd77?auto=format&fit=crop&q=80&w=320&h=220"
  },
  {
    id: "fs_23456",
    title: "Street Corner Bars",
    creator: {
      id: "u_223344",
      username: "LyricistPro",
      avatar: null
    },
    duration: 143, // seconds
    views: 8562,
    likes: 615,
    comments: 94,
    shares: 43,
    gifts: 18,
    status: "active",
    nsfw_score: 0.12,
    created_at: "2025-04-09T18:15:00Z",
    featured: false,
    tags: ["street", "bars", "urban"],
    thumbnail: "https://images.unsplash.com/photo-1520483601560-389dff434fdf?auto=format&fit=crop&q=80&w=320&h=220"
  },
  {
    id: "fs_34567",
    title: "Late Night Flow Session",
    creator: {
      id: "u_334455",
      username: "BeatBoxKing",
      avatar: null
    },
    duration: 175, // seconds
    views: 6234,
    likes: 523,
    comments: 78,
    shares: 31,
    gifts: 25,
    status: "flagged",
    nsfw_score: 0.72,
    created_at: "2025-04-08T22:45:00Z",
    featured: false,
    tags: ["night", "flow", "explicit"],
    thumbnail: "https://images.unsplash.com/photo-1526328828355-69b01f69024f?auto=format&fit=crop&q=80&w=320&h=220"
  },
  {
    id: "fs_45678",
    title: "Freestyle Friday Vol. 3",
    creator: {
      id: "u_445566",
      username: "RhymeQueen",
      avatar: null
    },
    duration: 118, // seconds
    views: 9823,
    likes: 723,
    comments: 131,
    shares: 59,
    gifts: 41,
    status: "active",
    nsfw_score: 0.08,
    created_at: "2025-04-07T20:10:00Z",
    featured: true,
    tags: ["friday", "weekly", "challenge"],
    thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80&w=320&h=220"
  },
  {
    id: "fs_56789",
    title: "Conscious Rap Thoughts",
    creator: {
      id: "u_556677",
      username: "ThoughtfulMC",
      avatar: null
    },
    duration: 203, // seconds
    views: 5421,
    likes: 412,
    comments: 86,
    shares: 27,
    gifts: 15,
    status: "suspended",
    nsfw_score: 0.31,
    created_at: "2025-04-06T16:30:00Z",
    featured: false,
    tags: ["conscious", "thoughtful", "message"],
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=320&h=220"
  },
  {
    id: "fs_67890",
    title: "90s Hip-Hop Tribute",
    creator: {
      id: "u_667788",
      username: "OldSchoolFan",
      avatar: null
    },
    duration: 167, // seconds
    views: 11324,
    likes: 945,
    comments: 173,
    shares: 82,
    gifts: 38,
    status: "active",
    nsfw_score: 0.15,
    created_at: "2025-04-05T13:20:00Z",
    featured: true,
    tags: ["90s", "hiphop", "tribute", "oldschool"],
    thumbnail: "https://images.unsplash.com/photo-1516893133975-bc044857c7c0?auto=format&fit=crop&q=80&w=320&h=220"
  }
];

// Mock data for top freestyle stats
const mockTopFreestyles = [
  {
    id: "fs_12345",
    title: "Summer Vibes Freestyle",
    creator: "FlowMaster",
    views: 12453,
    engagement: 92 // percentage
  },
  {
    id: "fs_67890",
    title: "90s Hip-Hop Tribute",
    creator: "OldSchoolFan",
    views: 11324,
    engagement: 87
  },
  {
    id: "fs_45678",
    title: "Freestyle Friday Vol. 3",
    creator: "RhymeQueen",
    views: 9823,
    engagement: 85
  },
  {
    id: "fs_23456",
    title: "Street Corner Bars",
    creator: "LyricistPro",
    views: 8562,
    engagement: 79
  },
  {
    id: "fs_34567",
    title: "Late Night Flow Session",
    creator: "BeatBoxKing",
    views: 6234,
    engagement: 71
  }
];

const Freestyles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedFreestyle, setSelectedFreestyle] = useState(null);
  const [freestyleDetailsOpen, setFreestyleDetailsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFeatured, setSelectedFeatured] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter freestyles based on all filters
  const filteredFreestyles = mockFreestyles.filter((freestyle) => {
    // Tab filter
    if (
      activeTab === "active" && freestyle.status !== "active" ||
      activeTab === "flagged" && freestyle.status !== "flagged" ||
      activeTab === "suspended" && freestyle.status !== "suspended"
    ) {
      return false;
    }

    // Search filter
    if (
      searchQuery &&
      !freestyle.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !freestyle.creator.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !freestyle.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }

    // Status filter
    if (selectedStatus !== "all" && freestyle.status !== selectedStatus) {
      return false;
    }

    // Featured filter
    if (
      selectedFeatured === "featured" && !freestyle.featured ||
      selectedFeatured === "not_featured" && freestyle.featured
    ) {
      return false;
    }

    return true;
  });

  // Sort freestyles
  const sortedFreestyles = [...filteredFreestyles].sort((a, b) => {
    switch (selectedSort) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "most_viewed":
        return b.views - a.views;
      case "most_liked":
        return b.likes - a.likes;
      case "most_gifted":
        return b.gifts - a.gifts;
      default:
        return 0;
    }
  });

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "flagged":
        return <Badge className="bg-yellow-500">Flagged</Badge>;
      case "suspended":
        return <Badge className="bg-red-500">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleFeatureToggle = (freestyle, featured) => {
    toast.success(`${freestyle.title} has been ${featured ? 'featured' : 'unfeatured'}`);
    // In a real app, we would update the server here
  };

  const handleStatusChange = (freestyle, newStatus) => {
    let message;
    switch (newStatus) {
      case "active":
        message = `${freestyle.title} has been activated`;
        break;
      case "flagged":
        message = `${freestyle.title} has been flagged for review`;
        break;
      case "suspended":
        message = `${freestyle.title} has been suspended`;
        break;
      default:
        message = `${freestyle.title} status updated to ${newStatus}`;
    }
    toast.success(message);
    // In a real app, we would update the server here
  };

  const resetFilters = () => {
    setSelectedStatus("all");
    setSelectedFeatured("all");
    setSelectedSort("newest");
    setSearchQuery("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Freestyle Content Management</h1>
          <p className="text-muted-foreground">Moderate and manage freestyle content.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Freestyles</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
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
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Featured</label>
                    <Select value={selectedFeatured} onValueChange={setSelectedFeatured}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Filter by featured" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="not_featured">Not Featured</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="most_viewed">Most Viewed</SelectItem>
                        <SelectItem value="most_liked">Most Liked</SelectItem>
                        <SelectItem value="most_gifted">Most Gifted</SelectItem>
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
                placeholder="Search by title, creator, or tags..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sortedFreestyles.map((freestyle) => (
                <Card key={freestyle.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img 
                      src={freestyle.thumbnail} 
                      alt={freestyle.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded-md flex items-center">
                      <Clock size={12} className="mr-1" /> {formatDuration(freestyle.duration)}
                    </div>
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full"
                    >
                      <Play className="h-6 w-6 text-white" />
                    </Button>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base line-clamp-1">{freestyle.title}</CardTitle>
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{freestyle.creator.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardDescription>{freestyle.creator.username}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              setSelectedFreestyle(freestyle);
                              setFreestyleDetailsOpen(true);
                            }}
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleFeatureToggle(freestyle, !freestyle.featured)}
                          >
                            <Flame size={16} />
                            <span>{freestyle.featured ? 'Unfeature' : 'Feature'}</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer text-green-600"
                            onClick={() => handleStatusChange(freestyle, "active")}
                            disabled={freestyle.status === "active"}
                          >
                            <CheckCircle size={16} />
                            <span>Set Active</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer text-yellow-500"
                            onClick={() => handleStatusChange(freestyle, "flagged")}
                            disabled={freestyle.status === "flagged"}
                          >
                            <Flag size={16} />
                            <span>Flag for Review</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer text-red-600"
                            onClick={() => handleStatusChange(freestyle, "suspended")}
                            disabled={freestyle.status === "suspended"}
                          >
                            <XCircle size={16} />
                            <span>Suspend</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-sm">
                          <Eye size={14} className="mr-1 text-muted-foreground" />
                          <span>{freestyle.views.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Views</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-sm">
                          <Heart size={14} className="mr-1 text-muted-foreground" />
                          <span>{freestyle.likes.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Likes</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-sm">
                          <Gift size={14} className="mr-1 text-muted-foreground" />
                          <span>{freestyle.gifts}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Gifts</span>
                      </div>
                    </div>
                    {freestyle.nsfw_score > 0.5 && (
                      <div className="flex items-center text-xs text-yellow-500 gap-1 mb-2">
                        <ShieldAlert size={14} />
                        <span>High NSFW score: {Math.round(freestyle.nsfw_score * 100)}%</span>
                      </div>
                    )}
                    <div className="flex gap-1 flex-wrap">
                      {freestyle.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between py-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(freestyle.created_at)}
                    </div>
                    {getStatusBadge(freestyle.status)}
                  </CardFooter>
                </Card>
              ))}
              
              {sortedFreestyles.length === 0 && (
                <div className="col-span-3 border rounded-lg p-8 flex flex-col items-center justify-center">
                  <Music size={48} className="text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No freestyles found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Freestyles</CardTitle>
                  <CardDescription>By views and engagement rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTopFreestyles.map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="text-2xl font-bold text-muted-foreground w-6 text-center">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="font-medium line-clamp-1">{item.title}</div>
                          <div className="text-sm text-muted-foreground">by {item.creator}</div>
                          <div className="flex justify-between text-sm">
                            <span>{item.views.toLocaleString()} views</span>
                            <span>{item.engagement}% engagement</span>
                          </div>
                          <Progress value={item.engagement} className="h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Overview</CardTitle>
                  <CardDescription>Freestyle uploads and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Total Freestyles</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-3xl font-bold">1,248</div>
                        <div className="flex items-center text-sm text-green-500">
                          <TrendingUp size={14} className="mr-1" />
                          <span>+12% this month</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Uploads Today</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-3xl font-bold">24</div>
                        <div className="flex items-center text-sm text-green-500">
                          <TrendingUp size={14} className="mr-1" />
                          <span>+8% vs yesterday</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Average Watch Time</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-3xl font-bold">1:24</div>
                        <div className="text-sm text-muted-foreground">minutes:seconds</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Content Flagged</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-3xl font-bold">3.2%</div>
                        <div className="text-sm text-muted-foreground">of total content</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Freestyle Details Dialog */}
      <Dialog open={freestyleDetailsOpen} onOpenChange={setFreestyleDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Freestyle Details</DialogTitle>
            <DialogDescription>
              View and manage freestyle content
            </DialogDescription>
          </DialogHeader>

          {selectedFreestyle && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                  <img 
                    src={selectedFreestyle.thumbnail} 
                    alt={selectedFreestyle.title}
                    className="object-cover w-full h-full"
                  />
                  <Button 
                    variant="secondary" 
                    size="icon"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{selectedFreestyle.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{formatDuration(selectedFreestyle.duration)}</span>
                      <span>•</span>
                      <span>{formatDate(selectedFreestyle.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedFreestyle.creator.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedFreestyle.creator.username}</div>
                      <div className="text-sm text-muted-foreground">Creator ID: {selectedFreestyle.creator.id}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedFreestyle.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant={selectedFreestyle.featured ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => handleFeatureToggle(selectedFreestyle, !selectedFreestyle.featured)}
                  >
                    <Flame size={16} />
                    {selectedFreestyle.featured ? 'Featured' : 'Feature'}
                  </Button>
                  
                  {selectedFreestyle.status !== "active" && (
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 text-green-600"
                      onClick={() => handleStatusChange(selectedFreestyle, "active")}
                    >
                      <CheckCircle size={16} />
                      Activate
                    </Button>
                  )}
                  
                  {selectedFreestyle.status !== "flagged" && (
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 text-yellow-500"
                      onClick={() => handleStatusChange(selectedFreestyle, "flagged")}
                    >
                      <Flag size={16} />
                      Flag
                    </Button>
                  )}
                  
                  {selectedFreestyle.status !== "suspended" && (
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 text-red-600"
                      onClick={() => handleStatusChange(selectedFreestyle, "suspended")}
                    >
                      <XCircle size={16} />
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                        <Eye size={20} className="text-muted-foreground mb-1" />
                        <div className="text-2xl font-bold">{selectedFreestyle.views.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                      
                      <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                        <ThumbsUp size={20} className="text-muted-foreground mb-1" />
                        <div className="text-2xl font-bold">{selectedFreestyle.likes.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </div>
                      
                      <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                        <MessageSquare size={20} className="text-muted-foreground mb-1" />
                        <div className="text-2xl font-bold">{selectedFreestyle.comments}</div>
                        <div className="text-xs text-muted-foreground">Comments</div>
                      </div>
                      
                      <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                        <Share2 size={20} className="text-muted-foreground mb-1" />
                        <div className="text-2xl font-bold">{selectedFreestyle.shares}</div>
                        <div className="text-xs text-muted-foreground">Shares</div>
                      </div>
                      
                      <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                        <Gift size={20} className="text-muted-foreground mb-1" />
                        <div className="text-2xl font-bold">{selectedFreestyle.gifts}</div>
                        <div className="text-xs text-muted-foreground">Gifts</div>
                      </div>
                      
                      <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                        <BarChart3 size={20} className="text-muted-foreground mb-1" />
                        <div className="text-2xl font-bold">
                          {Math.round(
                            ((selectedFreestyle.likes + selectedFreestyle.comments + selectedFreestyle.shares) / selectedFreestyle.views) * 100
                          )}%
                        </div>
                        <div className="text-xs text-muted-foreground">Engagement Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Content Safety</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={18} />
                            <span>NSFW Content Score</span>
                          </div>
                          <span className="font-medium">{Math.round(selectedFreestyle.nsfw_score * 100)}%</span>
                        </div>
                        <Progress 
                          value={selectedFreestyle.nsfw_score * 100} 
                          className="h-2"
                          indicatorClassName={selectedFreestyle.nsfw_score > 0.5 ? "bg-red-500" : "bg-green-500"}
                        />
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">AI Content Analysis</div>
                          <Badge variant={selectedFreestyle.nsfw_score > 0.5 ? "destructive" : "outline"}>
                            {selectedFreestyle.nsfw_score > 0.5 ? "Flagged" : "Approved"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedFreestyle.nsfw_score > 0.5 
                            ? "This content may violate community guidelines. Review recommended."
                            : "This content appears to comply with community guidelines."
                          }
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="confirm-review" />
                          <label htmlFor="confirm-review" className="text-sm">
                            I've reviewed this content and confirm it follows community guidelines
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setFreestyleDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Freestyles;
