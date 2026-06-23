
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

interface EngagementItemProps {
  feature: string;
  percentage: number;
}

interface EngagementCardProps {
  data: EngagementItemProps[];
}

// Coming soon: no per-feature usage event tracking exists in the backend
// yet, so engagement-by-feature can't be reported. Props kept for the
// future real shape instead of deleting this file.
const EngagementCard = (_props: EngagementCardProps) => {
  return (
    <NotAvailablePanel
      feature="Platform Engagement"
      reason="No per-feature usage event tracking exists yet."
    />
  );
};

export default EngagementCard;
