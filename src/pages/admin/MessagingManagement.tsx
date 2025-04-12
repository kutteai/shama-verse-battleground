
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessageModeration from "@/components/messaging/MessageModeration";
import MessagingAnalytics from "@/components/messaging/MessagingAnalytics";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";

// Define Message interface
interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  flagged: boolean;
  reason?: string;
}

const MessagingManagement = () => {
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'

  // Mock data for flagged messages
  const flaggedMessages: Message[] = [
    {
      id: "msg_001",
      sender: "user123",
      receiver: "creator456",
      content: "Hey, check out this link for free gifts...",
      timestamp: "2025-04-11T08:45:00Z",
      flagged: true,
      reason: "Spam/Advertising"
    },
    {
      id: "msg_002",
      sender: "anon_user",
      receiver: "popular_creator",
      content: "You're terrible at what you do. Everyone hates your content.",
      timestamp: "2025-04-10T19:23:00Z",
      flagged: true,
      reason: "Harassment"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messaging Management</h1>
            <p className="text-muted-foreground">Monitor and moderate direct messages between users</p>
          </div>
          <TimeframeToggle timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MessageModeration messages={flaggedMessages} />
          <MessagingAnalytics timeframe={timeframe} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagingManagement;
