
// Coming soon: no per-comment sentiment analysis, engagement-rate calculation,
// or time-series aggregation exists in the backend yet. Props kept to avoid
// breaking any callers while this is unimplemented.
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

interface CommentData {
  name: string;
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}

interface CommentAnalyticsProps {
  data?: CommentData[];
  totalComments?: number;
  avgCommentsPerContent?: number;
  commentEngagementRate?: string;
}

const CommentAnalytics = (_props: CommentAnalyticsProps) => {
  return (
    <NotAvailablePanel
      feature="Comment Analytics"
      reason="Sentiment analysis, engagement-rate calculation, and per-day comment trend aggregation are not implemented in the backend yet."
    />
  );
};

export default CommentAnalytics;
