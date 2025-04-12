
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MessageModeration from "@/components/messaging/MessageModeration";
import MessagingAnalytics from "@/components/messaging/MessagingAnalytics";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";
import { flaggedMessages, messagingAnalyticsData } from "@/data/adminDashboardData";

// Define Message interface with the correct structure to match the MessageModeration component
interface MessageItem {
  id: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  receiver: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  flagged: boolean;
  flagReason?: string;
}

const MessagingManagement = () => {
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'
  const [activeTimeframe, setActiveTimeframe] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Update timeframe for analytics when the main timeframe changes
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    
    switch (newTimeframe) {
      case "day":
        setActiveTimeframe("daily");
        break;
      case "week":
        setActiveTimeframe("weekly");
        break;
      case "month":
        setActiveTimeframe("monthly");
        break;
      default:
        setActiveTimeframe("weekly");
    }
  };

  // Mock data for messages with the correct structure
  const messages: MessageItem[] = [
    {
      id: "msg_001",
      sender: {
        id: "user123",
        name: "John Doe",
        username: "john_doe",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      receiver: {
        id: "creator456",
        name: "Jane Smith",
        username: "jane_smith",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      content: "Hey, check out this link for free gifts...",
      timestamp: "2025-04-11T08:45:00Z",
      flagged: true,
      flagReason: "Spam/Advertising"
    },
    {
      id: "msg_002",
      sender: {
        id: "anon_user",
        name: "Anonymous User",
        username: "anon_user",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      receiver: {
        id: "popular_creator",
        name: "Popular Creator",
        username: "popular_creator",
        avatar: "https://i.pravatar.cc/150?img=4"
      },
      content: "You're terrible at what you do. Everyone hates your content.",
      timestamp: "2025-04-10T19:23:00Z",
      flagged: true,
      flagReason: "Harassment"
    }
  ];

  // Convert the imported flagged messages to the correct format
  const flaggedMessageItems: MessageItem[] = flaggedMessages.map(msg => ({
    id: msg.id,
    sender: {
      id: msg.sender,
      name: msg.sender.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      username: msg.sender,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10) + 1}`
    },
    receiver: {
      id: msg.recipient,
      name: msg.recipient.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      username: msg.recipient,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 10) + 11}`
    },
    content: msg.content,
    timestamp: msg.timestamp,
    flagged: true,
    flagReason: msg.reason
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Messaging Management</h1>
            <p className="text-muted-foreground">Monitor and moderate direct messages between users</p>
          </div>
          <TimeframeToggle timeframe={timeframe} setTimeframe={handleTimeframeChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MessageModeration messages={messages} flaggedMessages={flaggedMessageItems} />
          <MessagingAnalytics 
            dailyData={messagingAnalyticsData.daily}
            weeklyData={messagingAnalyticsData.weekly}
            monthlyData={messagingAnalyticsData.monthly}
            activeTimeframe={activeTimeframe}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagingManagement;
