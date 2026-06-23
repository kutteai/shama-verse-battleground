
// Coming soon: per-creator earnings, upload frequency, win-rate, and time-series
// engagement data have no backing endpoint yet. Props kept to avoid breaking callers.
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  earningsData: { name: string; amount: number }[];
  engagementData: { name: string; value: number }[];
  stats: {
    earnings: number;
    uploadFrequency: string;
    winRate: string;
    fanEngagement: string;
  };
}

interface CreatorPerformanceProps {
  creator?: Creator;
}

const CreatorPerformance = (_props: CreatorPerformanceProps) => {
  return (
    <NotAvailablePanel
      feature="Creator Performance Detail"
      reason="Per-creator earnings, time-series engagement, and upload-frequency analytics are not implemented in the backend yet."
    />
  );
};

export default CreatorPerformance;
