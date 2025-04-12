
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Import challenges components
import ChallengeTable, { Challenge } from "@/components/challenges/ChallengeTable";
import ChallengeFilters from "@/components/challenges/ChallengeFilters";
import ChallengeStats from "@/components/challenges/ChallengeStats";
import ChallengeDialogs from "@/components/challenges/ChallengeDialogs";

// Import mock data
import { mockChallenges } from "@/data/challengeData";

const Challenges = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Dialog states
  const [isPauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [isBanDialogOpen, setBanDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // Action handlers
  const handleViewDetails = (challenge: Challenge) => {
    toast({
      title: "View Challenge Details",
      description: `Viewing details for ${challenge.title}`,
    });
    // In a real app, you would navigate to a details page
    // navigate(`/challenges/${challenge.id}`);
  };

  const handleViewVotingAnalytics = (challenge: Challenge) => {
    toast({
      title: "Voting Analytics",
      description: `Viewing voting analytics for ${challenge.title}`,
    });
    // In a real app, you would navigate to analytics page or show a modal
    // navigate(`/challenges/${challenge.id}/analytics`);
  };

  const handleViewGiftDonations = (challenge: Challenge) => {
    toast({
      title: "Gift Donations",
      description: `Viewing gift donations for ${challenge.title} (${challenge.giftTotal} total)`,
    });
    // In a real app, you would navigate to donations page or show a modal
    // navigate(`/challenges/${challenge.id}/donations`);
  };

  const openPauseDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setPauseDialogOpen(true);
  };

  const handlePauseChallenge = () => {
    if (!selectedChallenge) return;
    
    // In a real app, you would call an API to pause the challenge
    toast({
      title: "Challenge Paused",
      description: `${selectedChallenge.title} has been paused`,
    });
    
    // Update challenge status in UI
    const updatedChallenges = mockChallenges.map(challenge => 
      challenge.id === selectedChallenge.id 
        ? { ...challenge, status: "pending" }
        : challenge
    );
    
    // Close dialog
    setPauseDialogOpen(false);
  };

  const openBanDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setBanDialogOpen(true);
  };

  const handleBanChallenge = () => {
    if (!selectedChallenge) return;
    
    // In a real app, you would call an API to ban the challenge
    toast({
      title: "Challenge Banned",
      description: `${selectedChallenge.title} has been banned`,
      variant: "destructive"
    });
    
    // Update challenge status in UI
    const updatedChallenges = mockChallenges.map(challenge => 
      challenge.id === selectedChallenge.id 
        ? { ...challenge, status: "flagged" }
        : challenge
    );
    
    // Close dialog
    setBanDialogOpen(false);
  };

  const openDeleteDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setDeleteDialogOpen(true);
  };

  const handleDeleteChallenge = () => {
    if (!selectedChallenge) return;
    
    // In a real app, you would call an API to delete the challenge
    toast({
      title: "Challenge Deleted",
      description: `${selectedChallenge.title} has been deleted`,
      variant: "destructive"
    });
    
    // Close dialog
    setDeleteDialogOpen(false);
  };

  // Filter challenges based on all filters
  const filteredChallenges = mockChallenges.filter((challenge) => {
    // Tab filter
    if (
      activeTab === "ongoing" && challenge.status !== "ongoing" ||
      activeTab === "pending" && challenge.status !== "pending" ||
      activeTab === "completed" && challenge.status !== "completed" ||
      activeTab === "flagged" && challenge.status !== "flagged"
    ) {
      return false;
    }

    // Search filter
    if (
      searchQuery &&
      !challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !challenge.creator.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !challenge.challenger.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Type filter
    if (selectedType !== "all" && challenge.type !== selectedType) {
      return false;
    }

    // Category filter
    if (selectedCategory !== "all" && challenge.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (selectedStatus !== "all" && challenge.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const resetFilters = () => {
    setSelectedType("all");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges Management</h1>
          <p className="text-muted-foreground">Create and manage user challenges.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Challenges</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="flagged">Flagged</TabsTrigger>
            </TabsList>
          </div>

          <ChallengeFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            isFiltersOpen={isFiltersOpen}
            setIsFiltersOpen={setIsFiltersOpen}
            resetFilters={resetFilters}
          />

          <TabsContent value={activeTab} className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <ChallengeTable 
                  challenges={filteredChallenges}
                  onViewDetails={handleViewDetails}
                  onViewVotingAnalytics={handleViewVotingAnalytics}
                  onViewGiftDonations={handleViewGiftDonations}
                  onPauseChallenge={openPauseDialog}
                  onBanChallenge={openBanDialog}
                  onDeleteChallenge={openDeleteDialog}
                />
              </CardContent>
            </Card>

            <ChallengeStats challenges={mockChallenges} />
          </TabsContent>
        </Tabs>
      </div>

      <ChallengeDialogs 
        isPauseDialogOpen={isPauseDialogOpen}
        setPauseDialogOpen={setPauseDialogOpen}
        isBanDialogOpen={isBanDialogOpen}
        setBanDialogOpen={setBanDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedChallenge={selectedChallenge}
        onPauseChallenge={handlePauseChallenge}
        onBanChallenge={handleBanChallenge}
        onDeleteChallenge={handleDeleteChallenge}
      />
    </DashboardLayout>
  );
};

export default Challenges;
