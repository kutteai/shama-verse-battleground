
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SimpleAreaChart from "@/components/dashboard/SimpleAreaChart";
import TimeframeToggle from "@/components/dashboard/TimeframeToggle";
import RetentionCard from "@/components/dashboard/RetentionCard";
import EngagementCard from "@/components/dashboard/EngagementCard";
import TopEarningUsersCard from "@/components/dashboard/TopEarningUsersCard";
import MostGiftedUsersCard from "@/components/dashboard/MostGiftedUsersCard";
import RevenueStatsCard from "@/components/dashboard/RevenueStatsCard";

import { 
  Users, 
  Activity, 
  TrendingUp, 
  Gift, 
  DollarSign, 
  Calendar, 
  UserPlus,
  Video
} from "lucide-react";

import {
  userActivityData,
  revenueData,
  newUsersData,
  freestyleData,
  topUsers,
  mostGiftedUsers,
  retentionData,
  featureEngagement
} from "@/data/dashboardData";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("week"); // 'day', 'week', 'month'

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-shama-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Platform analytics and key metrics.</p>
          </div>
          <TimeframeToggle timeframe={timeframe} setTimeframe={setTimeframe} />
        </div>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Users" 
            value="24,567" 
            icon={<Users size={24} />} 
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard 
            title="Active Users" 
            value="1,874" 
            icon={<Activity size={24} />} 
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard 
            title="New Users" 
            value="437" 
            icon={<UserPlus size={24} />} 
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard 
            title="Total Gifts" 
            value="15,926" 
            icon={<Gift size={24} />} 
            trend={{ value: 5, isPositive: true }}
          />
        </div>
        
        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Challenges" 
            value="4,382" 
            icon={<TrendingUp size={24} />} 
            trend={{ value: 7, isPositive: true }}
          />
          <StatCard 
            title="Ongoing Challenges" 
            value="328" 
            icon={<Calendar size={24} />} 
            trend={{ value: 3, isPositive: false }}
          />
          <StatCard 
            title="Total Freestyles" 
            value="18,745" 
            icon={<Video size={24} />} 
            trend={{ value: 10, isPositive: true }}
          />
          <StatCard 
            title="Total Revenue" 
            value="$182,459" 
            icon={<DollarSign size={24} />} 
            trend={{ value: 16, isPositive: true }}
          />
        </div>

        {/* Charts - First Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SimpleAreaChart 
            title="User Activity & Challenges" 
            description="User activity and challenge creation over the past week" 
            data={userActivityData}
            dataKeys={[
              { key: "users", color: "#F44336", name: "Active Users" },
              { key: "challenges", color: "#4CAF50", name: "Challenges Created" }
            ]}
          />
          <SimpleAreaChart 
            title="Revenue & Gift Purchases" 
            description="Monthly revenue and gift purchase trends" 
            data={revenueData}
            dataKeys={[
              { key: "revenue", color: "#FF9800", name: "Total Revenue ($)" },
              { key: "gifts", color: "#2196F3", name: "Gift Purchases ($)" }
            ]}
          />
        </div>
        
        {/* Charts - Second Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SimpleAreaChart 
            title="New User Registration" 
            description="New user signups over the past week" 
            data={newUsersData}
            dataKeys={[
              { key: "users", color: "#9C27B0", name: "New Users" }
            ]}
          />
          <SimpleAreaChart 
            title="Freestyle Activity" 
            description="Freestyle uploads and views" 
            data={freestyleData}
            dataKeys={[
              { key: "uploads", color: "#E91E63", name: "Uploads" },
              { key: "views", color: "#3F51B5", name: "Views (hundreds)" }
            ]}
          />
        </div>
        
        {/* Retention and Engagement Stats Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RetentionCard data={retentionData} />
          <EngagementCard data={featureEngagement} />
        </div>
        
        {/* User Stats Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <TopEarningUsersCard users={topUsers} />
          <MostGiftedUsersCard users={mostGiftedUsers} />
          <RevenueStatsCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
