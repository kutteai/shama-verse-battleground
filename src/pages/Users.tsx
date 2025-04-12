
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Ban, 
  Mail, 
  AlertCircle,
  Plus,
  UserPlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock user data
const mockUsers = [
  { 
    id: 1, 
    username: "MicDropKing", 
    email: "micdropking@example.com",
    phone: "+1 (555) 123-4567",
    followers: 15420, 
    challenges: 98, 
    rating: 4.9, 
    status: "active", 
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  { 
    id: 2, 
    username: "FlowMaster", 
    email: "flowmaster@example.com",
    phone: "+1 (555) 234-5678",
    followers: 12890, 
    challenges: 76, 
    rating: 4.7, 
    status: "active", 
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  { 
    id: 3, 
    username: "BeatSlayer", 
    email: "beatslayer@example.com",
    phone: "+1 (555) 345-6789",
    followers: 11250, 
    challenges: 64, 
    rating: 4.8, 
    status: "active", 
    avatar: "https://i.pravatar.cc/150?img=10"
  },
  { 
    id: 4, 
    username: "RhymeQueen", 
    email: "rhymequeen@example.com",
    phone: "+1 (555) 456-7890",
    followers: 10780, 
    challenges: 58, 
    rating: 4.6, 
    status: "suspended", 
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  { 
    id: 5, 
    username: "VerseBeast", 
    email: "versebeast@example.com",
    phone: "+1 (555) 567-8901",
    followers: 8950, 
    challenges: 42, 
    rating: 4.5, 
    status: "active", 
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  { 
    id: 6, 
    username: "LyricLegend", 
    email: "lyriclegend@example.com",
    phone: "+1 (555) 678-9012",
    followers: 7840, 
    challenges: 38, 
    rating: 4.7, 
    status: "active", 
    avatar: "https://i.pravatar.cc/150?img=7"
  },
  { 
    id: 7, 
    username: "CypherCrusher", 
    email: "cyphercrusher@example.com",
    phone: "+1 (555) 789-0123",
    followers: 6950, 
    challenges: 31, 
    rating: 4.4, 
    status: "warned", 
    avatar: "https://i.pravatar.cc/150?img=6"
  },
  { 
    id: 8, 
    username: "SonicStyler", 
    email: "sonicstyle@example.com",
    phone: "+1 (555) 890-1234",
    followers: 5820, 
    challenges: 29, 
    rating: 4.3, 
    status: "active", 
    avatar: "https://i.pravatar.cc/150?img=5"
  },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false);
  const [contactUserDialogOpen, setContactUserDialogOpen] = useState(false);
  const [warnUserDialogOpen, setWarnUserDialogOpen] = useState(false);
  const [suspendUserDialogOpen, setSuspendUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  
  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "suspended":
        return "bg-red-500";
      case "warned":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setUserDetailsDialogOpen(true);
  };

  const handleContactUser = (user: any) => {
    setSelectedUser(user);
    setContactMessage("");
    setContactUserDialogOpen(true);
  };

  const handleWarnUser = (user: any) => {
    setSelectedUser(user);
    setWarningMessage("");
    setWarnUserDialogOpen(true);
  };

  const handleSuspendAccount = (user: any) => {
    setSelectedUser(user);
    setSuspensionReason("");
    setSuspendUserDialogOpen(true);
  };

  const submitWarning = () => {
    if (!warningMessage) {
      toast.error("Please provide a warning message");
      return;
    }
    toast.success(`Warning sent to ${selectedUser.username}`);
    setWarnUserDialogOpen(false);
  };

  const submitSuspension = () => {
    if (!suspensionReason) {
      toast.error("Please provide a reason for suspension");
      return;
    }
    toast.success(`${selectedUser.username}'s account has been suspended`);
    setSuspendUserDialogOpen(false);
  };

  const submitContactMessage = () => {
    if (!contactMessage) {
      toast.error("Please enter a message");
      return;
    }
    toast.success(`Message sent to ${selectedUser.username}`);
    setContactUserDialogOpen(false);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage platform users and their accounts.</p>
        </div>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter size={16} />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button className="flex items-center gap-1" onClick={() => setAddUserDialogOpen(true)}>
                  <UserPlus size={16} />
                  <span>Add User</span>
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Followers</TableHead>
                    <TableHead className="hidden md:table-cell">Challenges</TableHead>
                    <TableHead className="hidden sm:table-cell">Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.username} />
                            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.followers.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.challenges}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="flex items-center">
                          {user.rating}
                          <span className="text-yellow-500 ml-1">★</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`h-2 w-2 rounded-full ${getStatusColor(user.status)} mr-2`}></span>
                          <Badge variant="outline" className="capitalize">
                            {user.status}
                          </Badge>
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
                              className="cursor-pointer flex items-center"
                              onClick={() => handleViewProfile(user)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer flex items-center"
                              onClick={() => handleContactUser(user)}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Contact User</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer text-amber-500 flex items-center"
                              onClick={() => handleWarnUser(user)}
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              <span>Warn User</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-500 flex items-center"
                              onClick={() => handleSuspendAccount(user)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Suspend Account</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="py-6 text-center text-muted-foreground">
                  No users found matching your search criteria.
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing <strong>{filteredUsers.length}</strong> of <strong>{mockUsers.length}</strong> users
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account on the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter username" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("New user created successfully");
              setAddUserDialogOpen(false);
            }}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={userDetailsDialogOpen} onOpenChange={setUserDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                Detailed information about this user.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                  <AvatarFallback className="text-lg">{selectedUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedUser.username}</h2>
                  <div className="flex items-center mt-1">
                    <span className={`h-2 w-2 rounded-full ${getStatusColor(selectedUser.status)} mr-2`}></span>
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${selectedUser.email}`} className="text-blue-600 hover:underline">
                        {selectedUser.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <a href={`tel:${selectedUser.phone}`} className="text-blue-600 hover:underline">
                        {selectedUser.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-md bg-muted flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{selectedUser.followers.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">Followers</span>
                </div>
                <div className="p-4 rounded-md bg-muted flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{selectedUser.challenges}</span>
                  <span className="text-sm text-muted-foreground">Challenges</span>
                </div>
                <div className="p-4 rounded-md bg-muted flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{selectedUser.rating} <span className="text-yellow-500">★</span></span>
                  <span className="text-sm text-muted-foreground">Rating</span>
                </div>
                <div className="p-4 rounded-md bg-muted flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">42</span>
                  <span className="text-sm text-muted-foreground">Uploads</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Account Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => {
                    setUserDetailsDialogOpen(false);
                    setTimeout(() => handleContactUser(selectedUser), 100);
                  }}>
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 text-amber-500" onClick={() => {
                    setUserDetailsDialogOpen(false);
                    setTimeout(() => handleWarnUser(selectedUser), 100);
                  }}>
                    <AlertCircle className="h-4 w-4" />
                    <span>Warn</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 text-red-500" onClick={() => {
                    setUserDetailsDialogOpen(false);
                    setTimeout(() => handleSuspendAccount(selectedUser), 100);
                  }}>
                    <Ban className="h-4 w-4" />
                    <span>Suspend</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Contact User Dialog */}
      {selectedUser && (
        <Dialog open={contactUserDialogOpen} onOpenChange={setContactUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Contact User</DialogTitle>
              <DialogDescription>
                Send a message to {selectedUser.username}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.username}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {selectedUser.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {selectedUser.phone}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Enter message subject" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message here..."
                  rows={5}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setContactUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitContactMessage}>
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Warn User Dialog */}
      {selectedUser && (
        <Dialog open={warnUserDialogOpen} onOpenChange={setWarnUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Warn User</DialogTitle>
              <DialogDescription>
                Send a warning to {selectedUser.username}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.username}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="warning-reason">Warning Message</Label>
                <Textarea 
                  id="warning-reason" 
                  placeholder="Enter the reason for this warning..."
                  rows={5}
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                This warning will be sent to the user and logged in their account history.
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWarnUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" className="bg-amber-500 hover:bg-amber-600" onClick={submitWarning}>
                Send Warning
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Suspend User Dialog */}
      {selectedUser && (
        <Dialog open={suspendUserDialogOpen} onOpenChange={setSuspendUserDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Suspend Account</DialogTitle>
              <DialogDescription>
                Suspend {selectedUser.username}'s account. This action can be reversed later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.username}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="suspension-reason">Suspension Reason</Label>
                <Textarea 
                  id="suspension-reason" 
                  placeholder="Enter the reason for account suspension..."
                  rows={5}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                />
              </div>
              <div className="text-sm text-amber-600">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                The user will be unable to access their account until the suspension is lifted.
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSuspendUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={submitSuspension}>
                Suspend Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Users;
