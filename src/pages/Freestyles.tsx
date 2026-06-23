import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Music,
  Heart,
  Eye,
  Play,
  Calendar,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getFreestyles, type AdminFreestyleVideo, type FreestyleOrdering } from "@/lib/freestylesAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const ORDERING_OPTIONS: { value: FreestyleOrdering; label: string }[] = [
  { value: "-created_at", label: "Newest First" },
  { value: "created_at", label: "Oldest First" },
  { value: "-views_count", label: "Most Viewed" },
  { value: "-likes_count", label: "Most Liked" },
  { value: "-share_count", label: "Most Shared" },
];

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateString));

const Freestyles = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState<FreestyleOrdering>("-created_at");
  const [page, setPage] = useState(1);
  const [selectedFreestyle, setSelectedFreestyle] = useState<AdminFreestyleVideo | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const freestylesQuery = useQuery({
    queryKey: queryKeys.freestyles(search, ordering, page),
    queryFn: () => getFreestyles({ search, ordering, page }),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const results = freestylesQuery.data?.results ?? [];
  const topByViews = [...results].sort((a, b) => b.views_count - a.views_count).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Freestyle Content Management</h1>
          <p className="text-muted-foreground">Browse and review freestyle (personal) video uploads.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by title or creator username..."
              className="pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <Select value={ordering} onValueChange={(value) => { setOrdering(value as FreestyleOrdering); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {ORDERING_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {freestylesQuery.isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : freestylesQuery.isError ? (
          <p className="text-sm text-destructive">Failed to load freestyles.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((freestyle) => (
                <Card key={freestyle.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    {freestyle.thumbnail_url ? (
                      <img
                        src={freestyle.thumbnail_url}
                        alt={freestyle.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="text-muted-foreground" size={32} />
                      </div>
                    )}
                    {freestyle.video_url && (
                      <a
                        href={freestyle.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2"
                      >
                        <Play className="h-6 w-6 text-white" />
                      </a>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base line-clamp-1">{freestyle.title || "Untitled"}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={freestyle.user.profile_pic ?? undefined} />
                        <AvatarFallback>{freestyle.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <CardDescription>{freestyle.user.username}</CardDescription>
                      {freestyle.user.talent && (
                        <Badge variant="outline" className="text-xs">{freestyle.user.talent}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-sm">
                          <Eye size={14} className="mr-1 text-muted-foreground" />
                          <span>{freestyle.views_count.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Views</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-sm">
                          <Heart size={14} className="mr-1 text-muted-foreground" />
                          <span>{freestyle.likes_count.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Likes</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-sm">
                          <Share2 size={14} className="mr-1 text-muted-foreground" />
                          <span>{freestyle.share_count.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Shares</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center text-sm">
                          <Bookmark size={14} className="mr-1 text-muted-foreground" />
                          <span>{freestyle.favorite_count.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Saves</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between py-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(freestyle.created_at)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFreestyle(freestyle);
                        setDetailsOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {results.length === 0 && (
                <div className="col-span-3 border rounded-lg p-8 flex flex-col items-center justify-center">
                  <Music size={48} className="text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No freestyles found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search.</p>
                </div>
              )}
            </div>

            {(freestylesQuery.data?.next || freestylesQuery.data?.previous) && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!freestylesQuery.data?.previous}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} className="mr-1" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!freestylesQuery.data?.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Freestyles (this page)</CardTitle>
                  <CardDescription>By views, among currently loaded results</CardDescription>
                </CardHeader>
                <CardContent>
                  {topByViews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {topByViews.map((item, index) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <div className="text-2xl font-bold text-muted-foreground w-6 text-center">{index + 1}</div>
                          <div className="flex-1 space-y-1">
                            <div className="font-medium line-clamp-1">{item.title || "Untitled"}</div>
                            <div className="text-sm text-muted-foreground">by {item.user.username}</div>
                            <div className="text-sm">{item.views_count.toLocaleString()} views</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Overview</CardTitle>
                  <CardDescription>Freestyle upload totals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base">Total Freestyles</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-3xl font-bold">{(freestylesQuery.data?.count ?? 0).toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    {/* Coming soon: no per-day upload aggregation or watch-time/flag tracking exists yet. */}
                    <Card>
                      <CardHeader className="py-2">
                        <CardTitle className="text-base text-muted-foreground">Uploads Today</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="text-sm text-muted-foreground">Coming soon</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Freestyle Details</DialogTitle>
            <DialogDescription>Real engagement data for this upload.</DialogDescription>
          </DialogHeader>

          {selectedFreestyle && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
                {selectedFreestyle.thumbnail_url ? (
                  <img
                    src={selectedFreestyle.thumbnail_url}
                    alt={selectedFreestyle.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="text-muted-foreground" size={32} />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium">{selectedFreestyle.title || "Untitled"}</h3>
                <div className="text-sm text-muted-foreground">{formatDate(selectedFreestyle.created_at)}</div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedFreestyle.user.profile_pic ?? undefined} />
                  <AvatarFallback>{selectedFreestyle.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedFreestyle.user.username}</div>
                  {selectedFreestyle.user.talent && (
                    <div className="text-sm text-muted-foreground">{selectedFreestyle.user.talent}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                  <Eye size={20} className="text-muted-foreground mb-1" />
                  <div className="text-xl font-bold">{selectedFreestyle.views_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                  <Heart size={20} className="text-muted-foreground mb-1" />
                  <div className="text-xl font-bold">{selectedFreestyle.likes_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                  <Share2 size={20} className="text-muted-foreground mb-1" />
                  <div className="text-xl font-bold">{selectedFreestyle.share_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Shares</div>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center p-3 border rounded-md">
                  <Bookmark size={20} className="text-muted-foreground mb-1" />
                  <div className="text-xl font-bold">{selectedFreestyle.favorite_count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Saves</div>
                </div>
              </div>

              {/* Coming soon: no moderation status/feature flag or delete endpoint exists for
                  freestyle videos yet — admin actions here are read-only until that ships. */}
              <NotAvailablePanel
                feature="Administrative Actions"
                reason="Feature/suspend/delete actions for freestyle videos are not implemented in the backend yet."
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Freestyles;
