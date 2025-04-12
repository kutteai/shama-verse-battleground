import { useState, useEffect } from "react";
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
  Music,
  Settings as SettingsIcon,
  Bell,
  Mail,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { toast } from "sonner";

// Mock data for user settings
const mockUserSettings = {
  profile: {
    username: "FlowMaster",
    email: "flow@example.com",
    avatar: null,
    bio: "Passionate about music and community.",
    location: "New York, USA",
    website: "https://flowmaster.com",
  },
  notifications: {
    email_enabled: true,
    push_enabled: false,
    sms_enabled: false,
  },
  security: {
    password_last_changed: "2025-03-15T10:30:00Z",
    two_factor_auth: false,
    sessions: [
      {
        id: "session_12345",
        location: "New York, USA",
        device: "Chrome on Windows",
        last_active: "2025-04-11T14:30:00Z",
      },
      {
        id: "session_67890",
        location: "Los Angeles, USA",
        device: "Safari on macOS",
        last_active: "2025-04-10T22:15:00Z",
      },
    ],
  },
  privacy: {
    profile_visibility: "public",
    show_activity: true,
    allow_direct_messages: "everyone",
  },
  integrations: {
    discord_connected: true,
    twitter_connected: false,
    webhook_url: "https://example.com/webhook",
    webhook_events: ["user.created", "challenge.completed"],
  },
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState(mockUserSettings);
  const [showPassword, setShowPassword] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [apiKey, setApiKey] = useState("sk_test_1234567890abcdef"); // Mock API key
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("user.created");
  const [isDiscordConnected, setIsDiscordConnected] = useState(true);
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileChanges, setProfileChanges] = useState({
    username: settings.profile.username,
    email: settings.profile.email,
    bio: settings.profile.bio,
    location: settings.profile.location,
    website: settings.profile.website,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Update profileChanges when settings change (e.g., after saving)
    setProfileChanges({
      username: settings.profile.username,
      email: settings.profile.email,
      bio: settings.profile.bio,
      location: settings.profile.location,
      website: settings.profile.website,
    });
  }, [settings]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleApiKeyCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    toast({
      title: "API Key Copied",
      description: "API key copied to clipboard.",
    });
    setTimeout(() => {
      setApiKeyCopied(false);
    }, 2000);
  };

  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event);
    toast.info(`Webhook event updated to ${event}`);
  };

  const handleDiscordConnect = () => {
    setIsDiscordConnected(!isDiscordConnected);
    toast.success(`Discord ${isDiscordConnected ? 'disconnected' : 'connected'}`);
  };

  const handleTwitterConnect = () => {
    setIsTwitterConnected(!isTwitterConnected);
    toast.success(`Twitter ${isTwitterConnected ? 'disconnected' : 'connected'}`);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileChanges(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update settings with new profile info
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileChanges,
      },
    }));

    setIsSaving(false);
    setIsProfileDialogOpen(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelProfileChanges = () => {
    setIsProfileDialogOpen(false);
    // Revert changes
    setProfileChanges({
      username: settings.profile.username,
      email: settings.profile.email,
      bio: settings.profile.bio,
      location: settings.profile.location,
      website: settings.profile.website,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your platform settings.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Key className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            {/* <TabsTrigger value="privacy">
              <Eye className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger> */}
            <TabsTrigger value="integrations">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your basic profile details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={settings.profile.avatar} />
                    <AvatarFallback>{settings.profile.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username"
                    value={profileChanges.username}
                    onChange={handleProfileInputChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={profileChanges.email}
                    onChange={handleProfileInputChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    name="bio"
                    value={profileChanges.bio}
                    onChange={handleProfileInputChange}
                    placeholder="Write a short bio about yourself" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={profileChanges.location}
                    onChange={handleProfileInputChange}
                    placeholder="Your location" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    name="website"
                    type="url"
                    value={profileChanges.website}
                    onChange={handleProfileInputChange}
                    placeholder="Your website URL" 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setIsProfileDialogOpen(true)}>
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch 
                    id="email-notifications" 
                    checked={settings.notifications.email_enabled}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          email_enabled: checked,
                        },
                      }));
                      toast.info(`Email notifications ${checked ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch 
                    id="push-notifications" 
                    checked={settings.notifications.push_enabled}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          push_enabled: checked,
                        },
                      }));
                      toast.info(`Push notifications ${checked ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch 
                    id="sms-notifications" 
                    checked={settings.notifications.sms_enabled}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          sms_enabled: checked,
                        },
                      }));
                      toast.info(`SMS notifications ${checked ? 'enabled' : 'disabled'}`);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Password</Label>
                    <Button variant="link">Change Password</Button>
                  </div>
                  <div className="flex items-center">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value="password123" // Replace with actual password retrieval/masking logic
                      readOnly
                      className="mr-2"
                    />
                    <Button variant="outline" size="icon" onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Last changed: {format(new Date(settings.security.password_last_changed), "MMM d, yyyy")}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Two-Factor Authentication</Label>
                    <Switch 
                      checked={settings.security.two_factor_auth}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            two_factor_auth: checked,
                          },
                        }));
                        toast.info(`Two-factor authentication ${checked ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Enable two-factor authentication for enhanced security.</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Active Sessions</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settings.security.sessions.map(session => (
                        <TableRow key={session.id}>
                          <TableCell>{session.location}</TableCell>
                          <TableCell>{session.device}</TableCell>
                          <TableCell>{format(new Date(session.last_active), "MMM d, yyyy h:mm a")}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Logout</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your profile visibility and data sharing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select defaultValue={settings.privacy.profile_visibility} id="profile-visibility">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Who can see your profile.</p>
                </div>

                <div>
                  <Label htmlFor="activity-visibility">Show Activity</Label>
                  <Switch 
                    id="activity-visibility" 
                    checked={settings.privacy.show_activity}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          show_activity: checked,
                        },
                      }));
                      toast.info(`Activity visibility ${checked ? 'enabled' : 'disabled'}`);
                    }}
                  />
                  <p className="text-sm text-muted-foreground">Show your recent activity on your profile.</p>
                </div>

                <div>
                  <Label htmlFor="direct-messages">Allow Direct Messages</Label>
                  <Select defaultValue={settings.privacy.allow_direct_messages} id="direct-messages">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="none">No One</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Who can send you direct messages.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with other services and platforms.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>DC</AvatarFallback>
                    </Avatar>
                    <Label>Discord</Label>
                  </div>
                  <Button 
                    variant={isDiscordConnected ? "destructive" : "outline"}
                    onClick={handleDiscordConnect}
                  >
                    {isDiscordConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>TW</AvatarFallback>
                    </Avatar>
                    <Label>Twitter</Label>
                  </div>
                  <Button 
                    variant={isTwitterConnected ? "destructive" : "outline"}
                    onClick={handleTwitterConnect}
                  >
                    {isTwitterConnected ? "Disconnect" : "Connect"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Webhook Settings</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input 
                        id="webhook-url" 
                        type="url" 
                        placeholder="https://example.com/webhook" 
                        defaultValue={settings.integrations.webhook_url}
                      />
                    </div>
                    <div>
                      <Label>Event Type</Label>
                      <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user.created">User Created</SelectItem>
                          <SelectItem value="challenge.completed">Challenge Completed</SelectItem>
                          <SelectItem value="payment.successful">Payment Successful</SelectItem>
                          <SelectItem value="content.flagged">Content Flagged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleEventChange(selectedEvent)}>
                    Update Webhook
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex items-center">
                    <Input 
                      type={isApiKeyVisible ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="mr-2"
                    />
                    <Button variant="outline" size="icon" onClick={toggleApiKeyVisibility}>
                      {isApiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleApiKeyCopy}
                      disabled={apiKeyCopied}
                    >
                      {apiKeyCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Use this API key to access platform data.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input 
                id="username" 
                name="username"
                value={profileChanges.username}
                onChange={handleProfileInputChange}
                className="col-span-3" 
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={profileChanges.email}
                onChange={handleProfileInputChange}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="text-right mt-2">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={profileChanges.bio}
                onChange={handleProfileInputChange}
                className="col-span-3"
                placeholder="Tell us a little bit about yourself"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={profileChanges.location}
                onChange={handleProfileInputChange}
                className="col-span-3"
                placeholder="Where are you located?"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                type="url"
                id="website"
                name="website"
                value={profileChanges.website}
                onChange={handleProfileInputChange}
                className="col-span-3"
                placeholder="Your website URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleCancelProfileChanges}>
              Cancel
            </Button>
            <Button onClick={handleProfileSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  Saving...
                  {/* You can add a spinner here */}
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Settings;
