
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CommentModeration from "@/components/comments/CommentModeration";
import CommentAnalytics from "@/components/comments/CommentAnalytics";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";

// Define Comment type
interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  reported: boolean;
  reportReason?: string;
  contentType: "challenge" | "freestyle";
  contentTitle: string;
}

const CommentManagement = () => {
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'

  // Mock data for recent comments
  const recentComments: Comment[] = [
    {
      id: "comment_001",
      user: {
        name: "Alex Johnson",
        username: "alexflow",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      content: "This beat is absolutely fire! One of the best challenges I've seen this month.",
      timestamp: "2025-04-11T14:30:00Z",
      likes: 24,
      replies: 5,
      reported: false,
      contentType: "challenge" as const,
      contentTitle: "Summer Beat Battle"
    },
    {
      id: "comment_002",
      user: {
        name: "Taylor Swift",
        username: "talentswift",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      content: "Your flow is smooth as butter on this track. Can't wait to see more!",
      timestamp: "2025-04-11T10:15:00Z",
      likes: 42,
      replies: 3,
      reported: false,
      contentType: "freestyle" as const,
      contentTitle: "90s Hip-Hop Tribute"
    }
  ];
  
  // Mock data for reported comments
  const reportedComments: Comment[] = [
    {
      id: "comment_003",
      user: {
        name: "James Wilson",
        username: "jwilson",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      content: "This is terrible. You should quit now while you're behind.",
      timestamp: "2025-04-10T18:45:00Z",
      likes: 2,
      replies: 8,
      reported: true,
      reportReason: "Harassment/Bullying",
      contentType: "challenge" as const,
      contentTitle: "Freestyle Friday Vol. 3"
    },
    {
      id: "comment_004",
      user: {
        name: "Anonymous",
        username: "anon_user42",
        avatar: "https://i.pravatar.cc/150?img=7"
      },
      content: "Check out my profile for the best content and free gift cards!!! Click link in bio.",
      timestamp: "2025-04-09T22:20:00Z",
      likes: 0,
      replies: 0,
      reported: true,
      reportReason: "Spam/Advertising",
      contentType: "freestyle" as const,
      contentTitle: "Summer Vibes Freestyle"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Comment Management</h1>
            <p className="text-muted-foreground">Monitor and moderate user comments across the platform</p>
          </div>
          <TimeframeToggle timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <CommentModeration 
            comments={recentComments} 
            reportedComments={reportedComments} 
          />
          
          {/* Passing CommentAnalytics without the timeframe prop since it's not defined in its props */}
          <CommentAnalytics />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommentManagement;
