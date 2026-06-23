
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import ChallengeTable from "@/components/challenges/ChallengeTable";
import ChallengeFilters from "@/components/challenges/ChallengeFilters";
import ChallengeStats from "@/components/challenges/ChallengeStats";
import ChallengeDialogs from "@/components/challenges/ChallengeDialogs";

import {
  getChallenges,
  pauseChallenge,
  resumeChallenge,
  banChallenge,
  deleteChallenge,
  type AdminChallenge,
} from "@/lib/challengesAdminApi";
import { queryKeys } from "@/lib/queryKeys";

type DialogAction = "pause" | "ban" | "delete" | null;

const Challenges = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [page] = useState(1);

  const [dialogAction, setDialogAction] = useState<DialogAction>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<AdminChallenge | null>(null);

  const queryClient = useQueryClient();

  // Tab → status mapping: "running" tab maps to status 5
  const tabStatusMap: Record<string, string> = {
    running: "5",
    pending: "1",
    completed: "6",
    banned: "",
  };
  const effectiveStatus = activeTab !== "all" ? (tabStatusMap[activeTab] ?? "") : selectedStatus;
  const isBannedTab = activeTab === "banned";

  const challengesQuery = useQuery({
    queryKey: queryKeys.challenges(selectedStatus, selectedType, search, page),
    queryFn: () =>
      getChallenges({
        status: effectiveStatus ? Number(effectiveStatus) : undefined,
        challenge_type: selectedType ? Number(selectedType) : undefined,
        search: search || undefined,
        page,
      }),
  });

  const allData = challengesQuery.data;
  const allResults = allData?.results ?? [];
  const challenges = isBannedTab
    ? allResults.filter((c) => c.is_banned_by_admin)
    : activeTab !== "all"
    ? allResults.filter((c) => c.status_display.toLowerCase() === activeTab || c.status === Number(effectiveStatus))
    : allResults;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.challenges(selectedStatus, selectedType, search, page) });

  const pauseMutation = useMutation({
    mutationFn: () => pauseChallenge(selectedChallenge!.id),
    onSuccess: () => { toast.success("Challenge paused"); invalidate(); setDialogAction(null); },
    onError: (err: Error) => toast.error(err.message),
  });

  const resumeMutation = useMutation({
    mutationFn: (id: string) => resumeChallenge(id),
    onSuccess: () => { toast.success("Challenge resumed"); invalidate(); },
    onError: (err: Error) => toast.error(err.message),
  });

  const banMutation = useMutation({
    mutationFn: () => banChallenge(selectedChallenge!.id),
    onSuccess: () => { toast.success("Challenge banned"); invalidate(); setDialogAction(null); },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteChallenge(selectedChallenge!.id),
    onSuccess: () => { toast.success("Challenge deleted"); invalidate(); setDialogAction(null); },
    onError: (err: Error) => toast.error(err.message),
  });

  const resetFilters = () => {
    setSelectedType("");
    setSelectedStatus("");
    setSearchInput("");
    setSearch("");
  };

  const isPending =
    pauseMutation.isPending || banMutation.isPending || deleteMutation.isPending;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges Management</h1>
          <p className="text-muted-foreground">Review and moderate user challenges.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Challenges</TabsTrigger>
              <TabsTrigger value="running">Running</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="banned">Banned</TabsTrigger>
            </TabsList>
          </div>

          <ChallengeFilters
            searchQuery={searchInput}
            setSearchQuery={setSearchInput}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            resetFilters={resetFilters}
            onSearch={() => setSearch(searchInput)}
          />

          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                {challengesQuery.isLoading ? (
                  <div className="h-40 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : challengesQuery.isError ? (
                  <div className="p-4 text-sm text-destructive">Failed to load challenges.</div>
                ) : (
                  <ChallengeTable
                    challenges={challenges}
                    onPauseChallenge={(ch) => { setSelectedChallenge(ch); setDialogAction("pause"); }}
                    onResumeChallenge={(ch) => resumeMutation.mutate(ch.id)}
                    onBanChallenge={(ch) => { setSelectedChallenge(ch); setDialogAction("ban"); }}
                    onDeleteChallenge={(ch) => { setSelectedChallenge(ch); setDialogAction("delete"); }}
                  />
                )}
              </CardContent>
            </Card>

            <ChallengeStats challenges={allResults} totalCount={allData?.count ?? 0} />
          </TabsContent>
        </Tabs>
      </div>

      <ChallengeDialogs
        isPauseDialogOpen={dialogAction === "pause"}
        setPauseDialogOpen={(open) => !open && setDialogAction(null)}
        isBanDialogOpen={dialogAction === "ban"}
        setBanDialogOpen={(open) => !open && setDialogAction(null)}
        isDeleteDialogOpen={dialogAction === "delete"}
        setDeleteDialogOpen={(open) => !open && setDialogAction(null)}
        selectedChallenge={selectedChallenge}
        onPauseChallenge={() => pauseMutation.mutate()}
        onBanChallenge={() => banMutation.mutate()}
        onDeleteChallenge={() => deleteMutation.mutate()}
        isPending={isPending}
      />
    </DashboardLayout>
  );
};

export default Challenges;
