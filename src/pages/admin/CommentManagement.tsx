
import DashboardLayout from "@/components/layout/DashboardLayout";
import CommentModeration from "@/components/comments/CommentModeration";
import CommentAnalytics from "@/components/comments/CommentAnalytics";
import { commentData, reportedCommentsData, commentAnalyticsData } from "@/data/adminDashboardData";

const CommentManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comment Management</h1>
          <p className="text-muted-foreground">Moderate comments and track engagement</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <CommentAnalytics 
            data={commentAnalyticsData.data}
            totalComments={commentAnalyticsData.totalComments}
            avgCommentsPerContent={commentAnalyticsData.avgCommentsPerContent}
            commentEngagementRate={commentAnalyticsData.commentEngagementRate}
          />
          
          <CommentModeration 
            comments={commentData}
            reportedComments={reportedCommentsData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommentManagement;
