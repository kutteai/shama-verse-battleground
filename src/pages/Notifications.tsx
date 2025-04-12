
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Bell, Send, Users, User, Clock, Filter, CheckCircle, Search, Calendar, ChevronRight, Trash2, XCircle, AlertCircle } from "lucide-react";

// Mock notification template data
const notificationTemplates = [
  {
    id: 'template_1',
    title: 'New Challenge Announcement',
    content: 'Hey there! A new challenge has been launched. Join now to compete and win exciting prizes!',
  },
  {
    id: 'template_2',
    title: 'Account Verification',
    content: 'Your account has been verified. You now have access to all features of the platform.',
  },
  {
    id: 'template_3',
    title: 'Content Warning',
    content: 'Your recent upload has been flagged for review. Please check your content guidelines.',
  }
];

// Mock sent notifications
const sentNotifications = [
  {
    id: 'notif_1',
    title: 'New Platform Features',
    content: 'We\'ve added exciting new features to the platform! Check them out now.',
    recipients: 'All Users',
    sentAt: '2025-04-10T14:30:00Z',
    openRate: '67%',
    status: 'completed'
  },
  {
    id: 'notif_2',
    title: 'Maintenance Notification',
    content: 'Platform will be under maintenance from 2AM to 4AM EST tomorrow. Sorry for any inconvenience.',
    recipients: 'Active Users',
    sentAt: '2025-04-08T09:15:00Z',
    openRate: '72%',
    status: 'completed'
  },
  {
    id: 'notif_3',
    title: 'Special Weekend Challenge',
    content: 'Join our special weekend challenge with double rewards!',
    recipients: 'Premium Users',
    sentAt: '2025-04-05T16:45:00Z',
    openRate: '81%',
    status: 'completed'
  },
  {
    id: 'notif_4',
    title: 'Content Review Update',
    content: 'Your content has been reviewed and approved. It\'s now visible to all users.',
    recipients: '@FlowMaster',
    sentAt: '2025-04-11T11:20:00Z',
    openRate: '100%',
    status: 'completed'
  }
];

// Mock user data for recipient selection
const mockUsers = [
  { 
    id: 1, 
    username: "MicDropKing", 
    email: "micdropking@example.com",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  { 
    id: 2, 
    username: "FlowMaster", 
    email: "flowmaster@example.com",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  { 
    id: 3, 
    username: "BeatSlayer", 
    email: "beatslayer@example.com",
    avatar: "https://i.pravatar.cc/150?img=10"
  },
  { 
    id: 4, 
    username: "RhymeQueen", 
    email: "rhymequeen@example.com",
    avatar: "https://i.pravatar.cc/150?img=9"
  }
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [includeImage, setIncludeImage] = useState(false);
  const [scheduleNotification, setScheduleNotification] = useState(false);
  const [notificationDate, setNotificationDate] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  
  const handleSendNotification = () => {
    if (!title || !content) {
      toast.error("Please provide both title and content for the notification.");
      return;
    }

    // Show success toast
    toast.success("Notification sent successfully!");
    
    // Reset form
    setTitle("");
    setContent("");
    setRecipientType("all");
    setSelectedUsers([]);
    setIncludeImage(false);
    setScheduleNotification(false);
    setNotificationDate("");
    
    // Switch to sent tab
    setActiveTab("sent");
  };

  const handleSelectTemplate = (template: any) => {
    setTitle(template.title);
    setContent(template.content);
    setShowTemplates(false);
  };

  const handleRecipientTypeChange = (value: string) => {
    setRecipientType(value);
    if (value !== "specific") {
      setSelectedUsers([]);
    }
  };

  const handleUserSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredUsers(mockUsers);
    } else {
      setFilteredUsers(
        mockUsers.filter(
          (user) =>
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const toggleUserSelection = (username: string) => {
    if (selectedUsers.includes(username)) {
      setSelectedUsers(selectedUsers.filter(user => user !== username));
    } else {
      setSelectedUsers([...selectedUsers, username]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications & Announcements</h1>
          <p className="text-muted-foreground">Manage platform notifications and send announcements to users.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="compose">Compose Notification</TabsTrigger>
            <TabsTrigger value="sent">Sent Notifications</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compose" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  New Notification
                </CardTitle>
                <CardDescription>Create and send notifications to users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter notification title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Notification Content</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Enter notification message" 
                    rows={4} 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipients</Label>
                  <Select value={recipientType} onValueChange={handleRecipientTypeChange}>
                    <SelectTrigger id="recipient">
                      <SelectValue placeholder="Select recipient type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active Users (Last 7 days)</SelectItem>
                      <SelectItem value="premium">Premium Users</SelectItem>
                      <SelectItem value="creators">Creators</SelectItem>
                      <SelectItem value="specific">Specific Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {recipientType === "specific" && (
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input 
                        placeholder="Search users by name or email" 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => handleUserSearch(e.target.value)}
                      />
                    </div>
                    
                    <div className="h-48 overflow-y-auto border rounded-md">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div 
                            key={user.id} 
                            className={`flex items-center justify-between p-2 hover:bg-accent/50 cursor-pointer ${
                              selectedUsers.includes(user.username) ? "bg-accent" : ""
                            }`}
                            onClick={() => toggleUserSelection(user.username)}
                          >
                            <div className="flex items-center">
                              <Checkbox 
                                checked={selectedUsers.includes(user.username)}
                                className="mr-2"
                                onCheckedChange={() => toggleUserSelection(user.username)}
                              />
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={user.avatar} alt={user.username} />
                                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.username}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No users found
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {selectedUsers.length} users selected
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="include-image" 
                    checked={includeImage}
                    onCheckedChange={setIncludeImage}
                  />
                  <Label htmlFor="include-image">Include Image</Label>
                </div>
                
                {includeImage && (
                  <div className="space-y-2">
                    <Label htmlFor="notification-image">Upload Image</Label>
                    <Input id="notification-image" type="file" accept="image/*" />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="schedule-notification" 
                    checked={scheduleNotification}
                    onCheckedChange={setScheduleNotification}
                  />
                  <Label htmlFor="schedule-notification">Schedule for later</Label>
                </div>
                
                {scheduleNotification && (
                  <div className="space-y-2">
                    <Label htmlFor="notification-date">Schedule Date & Time</Label>
                    <Input 
                      id="notification-date" 
                      type="datetime-local" 
                      value={notificationDate}
                      onChange={(e) => setNotificationDate(e.target.value)} 
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTemplates(true)}
                    className="flex items-center gap-1"
                  >
                    <span>Use Template</span>
                  </Button>
                  
                  <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Notification Templates</DialogTitle>
                        <DialogDescription>
                          Select a template to use as a starting point
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 my-4">
                        {notificationTemplates.map((template) => (
                          <Card 
                            key={template.id}
                            className="cursor-pointer hover:border-primary transition-colors"
                            onClick={() => handleSelectTemplate(template)}
                          >
                            <CardContent className="pt-6">
                              <h3 className="font-medium">{template.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {template.content}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowTemplates(false)}>
                          Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setTitle("");
                  setContent("");
                  setRecipientType("all");
                  setSelectedUsers([]);
                  setIncludeImage(false);
                  setScheduleNotification(false);
                  setNotificationDate("");
                }}>
                  Clear
                </Button>
                <Button onClick={handleSendNotification}>
                  {scheduleNotification ? "Schedule Notification" : "Send Notification"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="sent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Sent Notifications
                </CardTitle>
                <CardDescription>View history of sent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentNotifications.map((notification) => (
                    <Card key={notification.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{notification.title}</h3>
                            <Badge variant="outline">{notification.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.content}
                          </p>
                          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Users className="mr-1 h-3 w-3" />
                              <span>To: {notification.recipients}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Sent: {formatDate(notification.sentAt)}</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              <span>Open rate: {notification.openRate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex px-4 py-2 md:py-4 md:px-2 md:border-l md:flex-col justify-center gap-2 bg-background">
                          <Button variant="ghost" size="sm" className="flex items-center">
                            <ChevronRight className="h-4 w-4 mr-1" />
                            <span className="text-xs">Details</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center text-destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Notification Templates
                </CardTitle>
                <CardDescription>Manage reusable notification templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{template.title}</CardTitle>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Bell className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-0">
                        <p className="text-sm text-muted-foreground">
                          {template.content}
                        </p>
                      </CardContent>
                      <CardFooter className="py-3">
                        <Button size="sm" variant="outline" className="ml-auto" onClick={() => {
                          setTitle(template.title);
                          setContent(template.content);
                          setActiveTab("compose");
                        }}>
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Create New Template</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
