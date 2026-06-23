import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  Mail,
  AlertCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";
import { toast } from "sonner";

import {
  getUsers,
  suspendUser,
  reactivateUser,
  warnUser,
  contactUser,
  type AccountStatus,
  type AdminUser,
} from "@/lib/usersAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const STATUS_FILTERS: { value: AccountStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "warned", label: "Warned" },
  { value: "suspended", label: "Suspended" },
];

const getStatusColor = (status: AccountStatus) => {
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

const Users = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "all">("all");
  const [page, setPage] = useState(1);

  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false);
  const [contactUserDialogOpen, setContactUserDialogOpen] = useState(false);
  const [warnUserDialogOpen, setWarnUserDialogOpen] = useState(false);
  const [suspendUserDialogOpen, setSuspendUserDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: queryKeys.users(search, statusFilter, page),
    queryFn: () =>
      getUsers({
        search: search || undefined,
        accountStatus: statusFilter === "all" ? undefined : statusFilter,
        page,
      }),
  });

  const invalidateUsers = () => queryClient.invalidateQueries({ queryKey: ["users"] });

  const warnMutation = useMutation({
    mutationFn: ({ userId, message }: { userId: number; message: string }) => warnUser(userId, message),
    onSuccess: (_data, variables) => {
      toast.success("Warning sent successfully");
      setWarnUserDialogOpen(false);
      invalidateUsers();
      void variables;
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send warning"),
  });

  const suspendMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) => suspendUser(userId, reason),
    onSuccess: () => {
      toast.success("Account suspended successfully");
      setSuspendUserDialogOpen(false);
      invalidateUsers();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to suspend account"),
  });

  const reactivateMutation = useMutation({
    mutationFn: (userId: number) => reactivateUser(userId),
    onSuccess: () => {
      toast.success("Account reactivated successfully");
      invalidateUsers();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to reactivate account"),
  });

  const contactMutation = useMutation({
    mutationFn: ({ userId, subject, message }: { userId: number; subject: string; message: string }) =>
      contactUser(userId, subject, message),
    onSuccess: () => {
      toast.success("Message sent successfully");
      setContactUserDialogOpen(false);
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send message"),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleViewProfile = (user: AdminUser) => {
    setSelectedUser(user);
    setUserDetailsDialogOpen(true);
  };

  const handleContactUser = (user: AdminUser) => {
    setSelectedUser(user);
    setContactSubject("");
    setContactMessage("");
    setContactUserDialogOpen(true);
  };

  const handleWarnUser = (user: AdminUser) => {
    setSelectedUser(user);
    setWarningMessage("");
    setWarnUserDialogOpen(true);
  };

  const handleSuspendAccount = (user: AdminUser) => {
    setSelectedUser(user);
    setSuspensionReason("");
    setSuspendUserDialogOpen(true);
  };

  const submitWarning = () => {
    if (!warningMessage || !selectedUser) {
      toast.error("Please provide a warning message");
      return;
    }
    warnMutation.mutate({ userId: selectedUser.id, message: warningMessage });
  };

  const submitSuspension = () => {
    if (!suspensionReason || !selectedUser) {
      toast.error("Please provide a reason for suspension");
      return;
    }
    suspendMutation.mutate({ userId: selectedUser.id, reason: suspensionReason });
  };

  const submitContactMessage = () => {
    if (!contactMessage || !contactSubject || !selectedUser) {
      toast.error("Please enter a subject and message");
      return;
    }
    contactMutation.mutate({ userId: selectedUser.id, subject: contactSubject, message: contactMessage });
  };

  const results = usersQuery.data?.results ?? [];

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
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search by username or email..."
                  className="pl-10"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </form>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as AccountStatus | "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Coming soon: no backend endpoint exists for admin-created user accounts yet. */}
              <Button className="flex items-center gap-1" onClick={() => setAddUserDialogOpen(true)}>
                <span>Add User</span>
              </Button>
            </div>

            {usersQuery.isLoading ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : usersQuery.isError ? (
              <p className="text-sm text-destructive">Failed to load users.</p>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">Followers</TableHead>
                        <TableHead className="hidden md:table-cell">Challenges</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profile_pic ?? undefined} alt={user.username} />
                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{user.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.followers_count.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.challenges_count}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={`h-2 w-2 rounded-full ${getStatusColor(user.account_status)} mr-2`}></span>
                              <Badge variant="outline" className="capitalize">
                                {user.account_status}
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
                                {user.account_status === "suspended" ? (
                                  <DropdownMenuItem
                                    className="cursor-pointer text-green-600 flex items-center"
                                    onClick={() => reactivateMutation.mutate(user.id)}
                                  >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    <span>Reactivate Account</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-500 flex items-center"
                                    onClick={() => handleSuspendAccount(user)}
                                  >
                                    <Ban className="mr-2 h-4 w-4" />
                                    <span>Suspend Account</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {results.length === 0 && (
                    <div className="py-6 text-center text-muted-foreground">
                      No users found matching your search criteria.
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing <strong>{results.length}</strong> of <strong>{usersQuery.data?.count ?? 0}</strong> users
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!usersQuery.data?.previous}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={16} className="mr-1" /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!usersQuery.data?.next}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog — Coming soon: no backend endpoint exists for admin-created
          user accounts; registration only happens via the user-facing signup flow. */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account on the platform.
            </DialogDescription>
          </DialogHeader>
          <NotAvailablePanel
            feature="Admin-Created Accounts"
            reason="No backend endpoint exists yet for creating user accounts from the admin dashboard."
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Close
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
                  <AvatarImage src={selectedUser.profile_pic ?? undefined} alt={selectedUser.username} />
                  <AvatarFallback className="text-lg">{selectedUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedUser.username}</h2>
                  <div className="flex items-center mt-1">
                    <span className={`h-2 w-2 rounded-full ${getStatusColor(selectedUser.account_status)} mr-2`}></span>
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.account_status}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${selectedUser.email}`} className="text-blue-600 hover:underline">
                        {selectedUser.email}
                      </a>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-md bg-muted flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{selectedUser.followers_count.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">Followers</span>
                </div>
                <div className="p-4 rounded-md bg-muted flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{selectedUser.challenges_count}</span>
                  <span className="text-sm text-muted-foreground">Challenges</span>
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
                  {selectedUser.account_status === "suspended" ? (
                    <Button variant="outline" className="flex items-center gap-2 text-green-600" onClick={() => {
                      reactivateMutation.mutate(selectedUser.id);
                      setUserDetailsDialogOpen(false);
                    }}>
                      <RotateCcw className="h-4 w-4" />
                      <span>Reactivate</span>
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex items-center gap-2 text-red-500" onClick={() => {
                      setUserDetailsDialogOpen(false);
                      setTimeout(() => handleSuspendAccount(selectedUser), 100);
                    }}>
                      <Ban className="h-4 w-4" />
                      <span>Suspend</span>
                    </Button>
                  )}
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
                  <AvatarImage src={selectedUser.profile_pic ?? undefined} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.username}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {selectedUser.email}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter message subject"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                />
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
              <Button onClick={submitContactMessage} disabled={contactMutation.isPending}>
                {contactMutation.isPending ? "Sending..." : "Send Message"}
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
                  <AvatarImage src={selectedUser.profile_pic ?? undefined} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username.charAt(0).toUpperCase()}</AvatarFallback>
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
                This warning will be sent to the user as a notification and marks their account status as "warned".
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWarnUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" className="bg-amber-500 hover:bg-amber-600" onClick={submitWarning} disabled={warnMutation.isPending}>
                {warnMutation.isPending ? "Sending..." : "Send Warning"}
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
                  <AvatarImage src={selectedUser.profile_pic ?? undefined} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.username.charAt(0).toUpperCase()}</AvatarFallback>
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
              <Button variant="destructive" onClick={submitSuspension} disabled={suspendMutation.isPending}>
                {suspendMutation.isPending ? "Suspending..." : "Suspend Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Users;
