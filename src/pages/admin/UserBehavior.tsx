
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserJourneyHeatmap from "@/components/analytics/UserJourneyHeatmap";
import UserBehaviorSegments from "@/components/analytics/UserBehaviorSegments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";
import { BarChart3 } from "lucide-react";
import { toast } from "sonner";

import { getUserSegments, type UserSegment } from "@/lib/userBehaviorApi";
import { queryKeys } from "@/lib/queryKeys";

// Static advisory text per segment — not computed, documented as approximations.
const SEGMENT_ADVICE: Record<string, { retention: string; actionsNeeded: string[] }> = {
  "New Users": {
    retention: "Varies — early onboarding window",
    actionsNeeded: [
      "Send welcome notification",
      "Guide to first challenge",
      "Prompt to complete profile",
    ],
  },
  "Highly Active": {
    retention: "High — engaged creators",
    actionsNeeded: [
      "Cross-promotion opportunities",
      "Creator analytics access",
      "Community recognition",
    ],
  },
  Casual: {
    retention: "Moderate — occasional viewers",
    actionsNeeded: [
      "More content suggestions",
      "Social engagement prompts",
      "Like-to-follow conversion",
    ],
  },
  Dormant: {
    retention: "Low — re-engagement needed",
    actionsNeeded: [
      "Re-engagement push notification",
      "Highlight new content",
      "Profile completion reminder",
    ],
  },
};

const DEFAULT_ADVICE = { retention: "—", actionsNeeded: [] };

const UserBehavior = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSegment, setSelectedSegment] = useState<UserSegment | null>(null);
  const [segmentDetailsOpen, setSegmentDetailsOpen] = useState(false);

  const segmentsQuery = useQuery({
    queryKey: queryKeys.userSegments,
    queryFn: getUserSegments,
  });

  const segments = segmentsQuery.data ?? [];

  const handleViewSegmentDetails = (segment: UserSegment) => {
    setSelectedSegment(segment);
    setSegmentDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Behavior Analytics</h1>
          <p className="text-muted-foreground">Analyze user segments and behavior patterns</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segments">User Segments</TabsTrigger>
            <TabsTrigger value="journeys">User Journeys</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Coming soon: engagement rate, churn rate, and new-user trend have no
                dedicated admin analytics endpoint — use Dashboard page for signup trends. */}
            <NotAvailablePanel
              feature="Overview Stats"
              reason="Engagement rate, churn rate, and activity trend aggregations are not implemented in the backend yet. See the Dashboard page for signup trends."
            />
            <UserJourneyHeatmap />
            {segmentsQuery.isLoading ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">Loading segments...</div>
            ) : segmentsQuery.isError ? (
              <p className="text-sm text-destructive">Failed to load segments.</p>
            ) : (
              <UserBehaviorSegments segments={segments} />
            )}
          </TabsContent>

          <TabsContent value="segments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Segments Analysis</CardTitle>
                <CardDescription>
                  Segments derived from activity thresholds on existing denormalized fields.
                  Retention estimates and action suggestions are advisory — not computed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {segmentsQuery.isLoading ? (
                  <div className="h-24 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : segmentsQuery.isError ? (
                  <p className="text-sm text-destructive">Failed to load segments.</p>
                ) : segments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No segment data yet.</p>
                ) : (
                  <div className="space-y-6">
                    {segments.map((segment) => {
                      const advice = SEGMENT_ADVICE[segment.name] ?? DEFAULT_ADVICE;
                      return (
                        <div key={segment.name} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">{segment.name}</h3>
                              <p className="text-sm text-muted-foreground">{segment.description}</p>
                            </div>
                            <Badge variant="outline">
                              {segment.count.toLocaleString()} users ({segment.percentage}%)
                            </Badge>
                          </div>
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Segment Size</span>
                              <span>{segment.percentage}%</span>
                            </div>
                            <Progress value={segment.percentage} className="h-1.5" />
                          </div>
                          <div className="flex justify-between mt-4">
                            <div className="text-sm space-y-1">
                              <div className="font-medium">Est. Retention:</div>
                              <div className="text-muted-foreground">{advice.retention}</div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="self-end"
                              onClick={() => handleViewSegmentDetails(segment)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journeys" className="space-y-4">
            {/* Coming soon: no per-user event tracking table exists in the backend. */}
            <NotAvailablePanel
              feature="User Journey Analysis"
              reason="Per-user event timelines require an activity log / event-tracking table that does not exist in the backend yet."
            />
          </TabsContent>
        </Tabs>
      </div>

      {selectedSegment && (
        <Dialog open={segmentDetailsOpen} onOpenChange={setSegmentDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedSegment.name}</DialogTitle>
              <DialogDescription>{selectedSegment.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{selectedSegment.count.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{selectedSegment.percentage}%</div>
                    <div className="text-sm text-muted-foreground">of Active Users</div>
                  </CardContent>
                </Card>
              </div>
              {(SEGMENT_ADVICE[selectedSegment.name]?.actionsNeeded ?? []).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Recommended Actions</h3>
                  <Card>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {(SEGMENT_ADVICE[selectedSegment.name]?.actionsNeeded ?? []).map((action, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setSegmentDetailsOpen(false)}>
                <BarChart3 className="h-4 w-4" />
                Close
              </Button>
              <Button
                disabled
                title="Coming soon — wire to Notifications broadcast with this segment's user IDs"
                onClick={() => {
                  toast.info("Targeted campaigns coming soon");
                  setSegmentDetailsOpen(false);
                }}
              >
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default UserBehavior;
