
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SimpleAreaChart from "@/components/dashboard/SimpleAreaChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Gift, 
  DollarSign, 
  Calendar, 
  Clock,
  Award
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock data for charts
  const userActivityData = [
    { name: "Mon", users: 420, challenges: 63 },
    { name: "Tue", users: 460, challenges: 58 },
    { name: "Wed", users: 540, challenges: 74 },
    { name: "Thu", users: 510, challenges: 82 },
    { name: "Fri", users: 620, challenges: 91 },
    { name: "Sat", users: 750, challenges: 105 },
    { name: "Sun", users: 680, challenges: 98 },
  ];

  const revenueData = [
    { name: "Jan", revenue: 12500, gifts: 7800 },
    { name: "Feb", revenue: 14200, gifts: 9200 },
    { name: "Mar", revenue: 15800, gifts: 10500 },
    { name: "Apr", revenue: 17900, gifts: 11800 },
    { name: "May", revenue: 19500, gifts: 13200 },
    { name: "Jun", revenue: 22100, gifts: 15500 },
    { name: "Jul", revenue: 24800, gifts: 17000 },
  ];

  // Mock data for top users
  const topUsers = [
    { name: "MicDropKing", followers: 15420, earnings: "$3,240" },
    { name: "FlowMaster", followers: 12890, earnings: "$2,850" },
    { name: "BeatSlayer", followers: 11250, earnings: "$2,410" },
    { name: "RhymeQueen", followers: 10780, earnings: "$1,980" },
    { name: "VerseBeast", followers: 8950, earnings: "$1,725" },
  ];

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Platform analytics and key metrics.</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Users" 
            value="24,567" 
            icon={<Users size={24} />} 
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard 
            title="Active Users Today" 
            value="1,874" 
            icon={<Activity size={24} />} 
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard 
            title="Total Challenges" 
            value="4,382" 
            icon={<TrendingUp size={24} />} 
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard 
            title="Gifts Sent Today" 
            value="756" 
            icon={<Gift size={24} />} 
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Charts */}
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
        
        {/* Additional Stats */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Engagement Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Platform Engagement</CardTitle>
              <CardDescription>Average time per session: 18 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Challenges Page</span>
                    </div>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Freestyle Feeds</span>
                    </div>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">User Profiles</span>
                    </div>
                    <span className="text-sm font-medium">17%</span>
                  </div>
                  <Progress value={17} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Other Pages</span>
                    </div>
                    <span className="text-sm font-medium">13%</span>
                  </div>
                  <Progress value={13} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Revenue Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Revenue Statistics</CardTitle>
              <CardDescription>Monthly growth: 16.8%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={16} className="text-green-500" />
                    <span className="text-sm font-medium">Total Revenue</span>
                  </div>
                  <span className="font-bold">$182,459</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gift size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">Gift Purchases</span>
                  </div>
                  <span className="font-bold">$95,320</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={16} className="text-orange-500" />
                    <span className="text-sm font-medium">Challenge Entries</span>
                  </div>
                  <span className="font-bold">$64,780</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award size={16} className="text-purple-500" />
                    <span className="text-sm font-medium">Premium Features</span>
                  </div>
                  <span className="font-bold">$22,359</span>
                </div>
                
                <Button className="w-full mt-2" variant="outline">View Detailed Report</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Users */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Top Performers</CardTitle>
              <CardDescription>Users with highest following & earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {index + 1}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="text-sm text-right">
                      <div className="font-medium">{user.followers.toLocaleString()} followers</div>
                      <div className="text-muted-foreground">{user.earnings}</div>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full mt-2" variant="outline">View All Users</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
