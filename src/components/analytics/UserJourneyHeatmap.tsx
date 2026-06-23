
// Coming soon: no per-user event tracking table (UserEvent/ActivityLog) exists
// in the backend — heatmap/funnel data cannot be derived from current models.
// Props kept to avoid breaking any remaining callers.
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

interface HeatmapCell {
  stage: string;
  value: number;
  color: string;
}

interface HeatmapRow {
  name: string;
  cells: HeatmapCell[];
}

interface UserJourneyHeatmapProps {
  data?: HeatmapRow[];
}

const UserJourneyHeatmap = (_props: UserJourneyHeatmapProps) => {
  return (
    <NotAvailablePanel
      feature="User Journey Heatmap"
      reason="Per-user event tracking (activity log / funnel data) is not implemented in the backend yet."
    />
  );
};

export default UserJourneyHeatmap;
