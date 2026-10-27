import { useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Mail, AlertCircle, Ban, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getUserDetail,
  suspendUser,
  reactivateUser,
  warnUser,
  contactUser,
  toggleUserOnboarding,
  type AccountStatus,
} from "@/lib/usersAdminApi";
import { getChallenges, CHALLENGE_STATUS } from "@/lib/challengesAdminApi";
import { queryKeys } from "@/lib/queryKeys";

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

function StatCard({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string | number;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`p-4 rounded-md bg-muted flex flex-col items-center justify-center w-full ${
        onClick ? "hover:bg-muted/70 transition-colors cursor-pointer" : ""
      }`}
    >
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </Comp>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const id = Number(userId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [warnDialogOpen, setWarnDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");
  const [challengesPage, setChallengesPage] = useState(1);
  const challengesSectionRef = useRef<HTMLDivElement>(null);

  const userQuery = useQuery({
    queryKey: queryKeys.userDetail(id),
    queryFn: () => getUserDetail(id),
    enabled: Number.isFinite(id),
  });

  const challengesQuery = useQuery({
    queryKey: queryKeys.userChallenges(id, challengesPage),
    queryFn: () => getChallenges({ user_id: id, page: challengesPage }),
    enabled: Number.isFinite(id),
  });

  const scrollToChallenges = () => {
    challengesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.userDetail(id) });

  const toggleOnboardingMutation = useMutation({
    mutationFn: () => toggleUserOnboarding(id),
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message || "Failed to update onboarding status"),
  });

  const contactMutation = useMutation({
    mutationFn: () => contactUser(id, contactSubject, contactMessage),
    onSuccess: () => {
      toast.success("Message sent successfully");
      setContactDialogOpen(false);
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send message"),
  });

  const warnMutation = useMutation({
    mutationFn: () => warnUser(id, warningMessage),
    onSuccess: () => {
      toast.success("Warning sent successfully");
      setWarnDialogOpen(false);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send warning"),
  });

  const suspendMutation = useMutation({
    mutationFn: () => suspendUser(id, suspensionReason),
    onSuccess: () => {
      toast.success("Account suspended successfully");
      setSuspendDialogOpen(false);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to suspend account"),
  });

  const reactivateMutation = useMutation({
    mutationFn: () => reactivateUser(id),
    onSuccess: () => {
      toast.success("Account reactivated successfully");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to reactivate account"),
  });

  const user = userQuery.data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/users")} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Users
        </Button>

        {userQuery.isLoading && (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        )}
        {userQuery.isError && <p className="text-sm text-destructive">Failed to load this user.</p>}

        {user && (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 border-2 border-primary">
                    <AvatarImage src={user.profile_pic ?? undefined} alt={user.username} />
                    <AvatarFallback className="text-lg">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(user.account_status)}`} />
                      <Badge variant="outline" className="capitalize">{user.account_status}</Badge>
                      {user.is_verified && <Badge>Verified</Badge>}
                      {user.location_challenge_tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="font-mono">{tag}</Badge>
                      ))}
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                      </div>
                      {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                      {user.location && <p className="text-sm text-muted-foreground">📍 {user.location}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="onboarding-switch" className="text-sm">Onboarding watched</Label>
                    <Switch
                      id="onboarding-switch"
                      checked={user.watch_onboarding}
                      onCheckedChange={() => toggleOnboardingMutation.mutate()}
                      disabled={toggleOnboardingMutation.isPending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <StatCard label="Followers" value={user.followers_count.toLocaleString()} />
                  <StatCard label="Following" value={user.following_count.toLocaleString()} />
                  <StatCard label="Challenges" value={user.challenges_count} onClick={scrollToChallenges} />
                  <StatCard label="Votes" value={user.votes_count} />
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Account Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => {
                        setContactSubject("");
                        setContactMessage("");
                        setContactDialogOpen(true);
                      }}
                    >
                      <Mail className="h-4 w-4" /> Contact
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-amber-500"
                      onClick={() => {
                        setWarningMessage("");
                        setWarnDialogOpen(true);
                      }}
                    >
                      <AlertCircle className="h-4 w-4" /> Warn
                    </Button>
                    {user.account_status === "suspended" ? (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 text-green-600"
                        onClick={() => reactivateMutation.mutate()}
                      >
                        <RotateCcw className="h-4 w-4" /> Reactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 text-red-500"
                        onClick={() => {
                          setSuspensionReason("");
                          setSuspendDialogOpen(true);
                        }}
                      >
                        <Ban className="h-4 w-4" /> Suspend
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <InfoRow label="About" value={user.about_me} />
                <InfoRow label="Inspiration" value={user.inspiration} />
                <InfoRow label="Hobby" value={user.hobby} />
                <InfoRow label="Fun fact" value={user.fun_fact} />
                <InfoRow label="Date of birth" value={user.dob} />
                <InfoRow
                  label="Joined"
                  value={user.date_joined ? new Date(user.date_joined).toLocaleDateString() : null}
                />
                <InfoRow
                  label="Last active"
                  value={user.last_active ? new Date(user.last_active).toLocaleString() : null}
                />
                <InfoRow label="Account balance" value={`$${user.account_balance}`} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Flags</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge variant={user.community_rules ? "default" : "outline"}>
                  Community rules {user.community_rules ? "accepted" : "not accepted"}
                </Badge>
                <Badge variant={user.content_disclaimer ? "default" : "outline"}>
                  Content disclaimer {user.content_disclaimer ? "accepted" : "not accepted"}
                </Badge>
                <Badge variant={user.is_admin ? "default" : "outline"}>
                  {user.is_admin ? "Admin" : "Not admin"}
                </Badge>
              </CardContent>
            </Card>

            <div ref={challengesSectionRef} className="scroll-mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  {challengesQuery.isLoading ? (
                    <div className="h-24 flex items-center justify-center text-muted-foreground">Loading...</div>
                  ) : challengesQuery.isError ? (
                    <p className="text-sm text-destructive">Failed to load challenges.</p>
                  ) : challengesQuery.data && challengesQuery.data.results.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Opponent</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {challengesQuery.data.results.map((ch) => {
                          const opponent = ch.challenger.id === id ? ch.challengee : ch.challenger;
                          return (
                            <TableRow key={ch.id}>
                              <TableCell className="font-medium max-w-[200px] truncate">{ch.title}</TableCell>
                              <TableCell>
                                <Link to={`/users/${opponent.id}`} className="text-blue-600 hover:underline">
                                  {opponent.username}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{CHALLENGE_STATUS[ch.status] ?? ch.status_display}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {ch.challenge_type_display}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(ch.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground py-6 text-center">No challenges yet.</p>
                  )}
                </CardContent>
                {challengesQuery.data && challengesQuery.data.results.length > 0 && (
                  <CardFooter className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing <strong>{challengesQuery.data.results.length}</strong> of{" "}
                      <strong>{challengesQuery.data.count}</strong>
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!challengesQuery.data.previous}
                        onClick={() => setChallengesPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft size={16} className="mr-1" /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!challengesQuery.data.next}
                        onClick={() => setChallengesPage((p) => p + 1)}
                      >
                        Next <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact User</DialogTitle>
            <DialogDescription>Send a message to {user?.username}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!contactSubject || !contactMessage) {
                  toast.error("Please enter a subject and message");
                  return;
                }
                contactMutation.mutate();
              }}
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warn Dialog */}
      <Dialog open={warnDialogOpen} onOpenChange={setWarnDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Warn User</DialogTitle>
            <DialogDescription>Send a warning to {user?.username}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarnDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => {
                if (!warningMessage) {
                  toast.error("Please provide a warning message");
                  return;
                }
                warnMutation.mutate();
              }}
              disabled={warnMutation.isPending}
            >
              {warnMutation.isPending ? "Sending..." : "Send Warning"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Suspend Account</DialogTitle>
            <DialogDescription>
              Suspend {user?.username}'s account. This action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!suspensionReason) {
                  toast.error("Please provide a reason for suspension");
                  return;
                }
                suspendMutation.mutate();
              }}
              disabled={suspendMutation.isPending}
            >
              {suspendMutation.isPending ? "Suspending..." : "Suspend Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
