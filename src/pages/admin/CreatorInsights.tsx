
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatorPerformance from "@/components/creators/CreatorPerformance";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, ShieldCheck, Users, Heart, Award, ChevronLeft, ChevronRight, Mail, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { getCreatorInsights, toggleUserVerified, type AdminCreator, type CreatorSortBy } from "@/lib/creatorInsightsApi";
import { queryKeys } from "@/lib/queryKeys";

const SORT_OPTIONS: { value: CreatorSortBy; label: string }[] = [
  { value: "followers_count", label: "Most Followers" },
  { value: "likes_count", label: "Most Likes" },
  { value: "challenges_count", label: "Most Challenges" },
  { value: "date_joined", label: "Newest" },
];

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));

const CreatorInsights = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<CreatorSortBy>("followers_count");
  const [page, setPage] = useState(1);
  const [selectedCreator, setSelectedCreator] = useState<AdminCreator | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const queryClient = useQueryClient();

  const insightsQuery = useQuery({
    queryKey: queryKeys.creatorInsights(search, sortBy, page),
    queryFn: () => getCreatorInsights({ search: search || undefined, sort_by: sortBy, page }),
  });

  const verifyMutation = useMutation({
    mutationFn: (userId: number) => toggleUserVerified(userId),
    onSuccess: (data, userId) => {
      toast.success(data.is_verified ? "Creator verified" : "Verification removed");
      queryClient.invalidateQueries({ queryKey: ["creator-insights"] });
      // Update selected creator dialog state immediately
      if (selectedCreator?.id === userId) {
        setSelectedCreator((prev) => prev ? { ...prev, is_verified: data.is_verified } : null);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update verification");
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const results = insightsQuery.data?.results ?? [];
  const totalVerified = results.filter((c) => c.is_verified).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creator Insights</h1>
          <p className="text-muted-foreground">Track creator performance and manage verification status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Total Creators (this page)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(insightsQuery.data?.count ?? 0).toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                Verified (this page)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVerified}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Total Likes (this page)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {results.reduce((s, c) => s + c.likes_count, 0).toLocaleString()}
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
                <CardTitle>Creator Directory</CardTitle>
                <CardDescription>All active non-admin users, sorted by selected metric</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search by username or email..."
                      className="pl-9"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </form>
                  <Select value={sortBy} onValueChange={(v) => { setSortBy(v as CreatorSortBy); setPage(1); }}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {insightsQuery.isLoading ? (
                  <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : insightsQuery.isError ? (
                  <p className="text-sm text-destructive">Failed to load creators.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead className="hidden md:table-cell">Followers</TableHead>
                        <TableHead className="hidden md:table-cell">Challenges</TableHead>
                        <TableHead className="hidden sm:table-cell">Likes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((creator) => (
                        <TableRow key={creator.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={creator.profile_pic ?? undefined} />
                                  <AvatarFallback>{creator.username.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                {creator.is_verified && (
                                  <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                                    <ShieldCheck className="h-2.5 w-2.5 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">@{creator.username}</div>
                                <div className="text-xs text-muted-foreground">{creator.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{creator.followers_count.toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">{creator.challenges_count.toLocaleString()}</TableCell>
                          <TableCell className="hidden sm:table-cell">{creator.likes_count.toLocaleString()}</TableCell>
                          <TableCell>
                            {creator.is_verified ? (
                              <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">Unverified</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={creator.is_verified ? "text-muted-foreground" : "text-blue-500"}
                                disabled={verifyMutation.isPending}
                                onClick={() => verifyMutation.mutate(creator.id)}
                              >
                                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                {creator.is_verified ? "Unverify" : "Verify"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setSelectedCreator(creator); setDetailsOpen(true); }}
                              >
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {!insightsQuery.isLoading && results.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">No creators found.</div>
                )}
              </CardContent>
              {(insightsQuery.data?.next || insightsQuery.data?.previous) && (
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} · {insightsQuery.data?.count ?? 0} total
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={!insightsQuery.data?.previous} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                      <ChevronLeft size={14} className="mr-1" /> Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={!insightsQuery.data?.next} onClick={() => setPage((p) => p + 1)}>
                      Next <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="creator-detail">
            {/* Coming soon: per-creator earnings/engagement-trend detail endpoint not yet built */}
            <CreatorPerformance />
          </TabsContent>
        </Tabs>
      </div>

      {selectedCreator && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle>Creator Profile</DialogTitle>
              <DialogDescription>Account details and real-time stats</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCreator.profile_pic ?? undefined} />
                  <AvatarFallback className="text-lg">{selectedCreator.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">@{selectedCreator.username}</span>
                    {selectedCreator.is_verified && <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Mail className="h-3 w-3" />
                    {selectedCreator.email}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    Joined {formatDate(selectedCreator.date_joined)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-md bg-muted text-center">
                  <div className="text-xl font-bold">{selectedCreator.followers_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div className="p-3 rounded-md bg-muted text-center">
                  <div className="text-xl font-bold">{selectedCreator.challenges_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Challenges</div>
                </div>
                <div className="p-3 rounded-md bg-muted text-center">
                  <div className="text-xl font-bold">{selectedCreator.likes_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
              </div>
              <Button
                className="w-full"
                variant={selectedCreator.is_verified ? "outline" : "default"}
                disabled={verifyMutation.isPending}
                onClick={() => verifyMutation.mutate(selectedCreator.id)}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                {selectedCreator.is_verified ? "Remove Verification" : "Verify Creator"}
              </Button>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Earnings, badges, and content detail coming soon.
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default CreatorInsights;
