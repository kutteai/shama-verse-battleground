
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

interface RetentionDataProps {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

interface RetentionCardProps {
  data: RetentionDataProps;
}

// Coming soon: cohort retention (day1/7/30/90) has not been computed on the
// backend yet. Props kept for the future real shape instead of deleting
// this file.
const RetentionCard = (_props: RetentionCardProps) => {
  return (
    <NotAvailablePanel
      feature="User Retention"
      reason="Cohort retention analysis has not been computed yet."
    />
  );
};

export default RetentionCard;
