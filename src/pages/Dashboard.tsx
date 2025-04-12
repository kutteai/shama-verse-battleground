
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
  Award,
  UserPlus,
  Crown,
  Video,
  Monitor,
  BarChart2
} from "lucide-react";

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

  const newUsersData = [
    { name: "Mon", users: 124 },
    { name: "Tue", users: 145 },
    { name: "Wed", users: 132 },
    { name: "Thu", users: 156 },
    { name: "Fri", users: 187 },
    { name: "Sat", users: 210 },
    { name: "Sun", users: 183 },
  ];

  const freestyleData = [
    { name: "Mon", uploads: 78, views: 1240 },
    { name: "Tue", uploads: 84, views: 1380 },
    { name: "Wed", uploads: 92, views: 1520 },
    { name: "Thu", uploads: 86, views: 1450 },
    { name: "Fri", uploads: 105, views: 1680 },
    { name: "Sat", uploads: 124, views: 1950 },
    { name: "Sun", uploads: 118, views: 1840 },
  ];

  // Mock data for top users
  const topUsers = [
    { name: "MicDropKing", followers: 15420, earnings: "$3,240" },
    { name: "FlowMaster", followers: 12890, earnings: "$2,850" },
    { name: "BeatSlayer", followers: 11250, earnings: "$2,410" },
    { name: "RhymeQueen", followers: 10780, earnings: "$1,980" },
    { name: "VerseBeast", followers: 8950, earnings: "$1,725" },
  ];

  // Mock data for most gifted users
  const mostGiftedUsers = [
    { name: "LyricMaster", giftsReceived: 572, giftValue: "$2,860" },
    { name: "BeatMaker", giftsReceived: 498, giftValue: "$2,490" },
    { name: "FlowQueen", giftsReceived: 432, giftValue: "$2,160" },
    { name: "RhymeKing", giftsReceived: 387, giftValue: "$1,935" },
    { name: "VerseGenius", giftsReceived: 341, giftValue: "$1,705" },
  ];

  // User retention data
  const retentionData = {
    day1: 84,
    day7: 61,
    day30: 42,
    day90: 28
  };

  // Engagement by feature
  const featureEngagement = [
    { feature: "Challenges", percentage: 42 },
    { feature: "Freestyle Feeds", percentage: 28 },
    { feature: "Profiles", percentage: 17 },
    { feature: "Gift Shop", percentage: 8 },
    { feature: "Settings", percentage: 5 },
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

  // Function to render the timeframe toggle buttons
  const renderTimeframeToggle = () => (
    <div className="inline-flex rounded-md shadow-sm mb-6">
      <Button 
        variant={timeframe === "day" ? "default" : "outline"} 
        className="rounded-l-md rounded-r-none"
        onClick={() => setTimeframe("day")}
      >
        Today
      </Button>
      <Button 
        variant={timeframe === "week" ? "default" : "outline"} 
        className="rounded-none border-l-0 border-r-0"
        onClick={() => setTimeframe("week")}
      >
        This Week
      </Button>
      <Button 
        variant={timeframe === "month" ? "default" : "outline"} 
        className="rounded-r-md rounded-l-none"
        onClick={() => setTimeframe("month")}
      >
        This Month
      </Button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Platform analytics and key metrics.</p>
          </div>
          {renderTimeframeToggle()}
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
          {/* User Retention Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-blue-500" />
                User Retention
              </CardTitle>
              <CardDescription>Percentage of users returning to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Day 1 Retention</span>
                    <span className="font-medium">{retentionData.day1}%</span>
                  </div>
                  <Progress value={retentionData.day1} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Day 7 Retention</span>
                    <span className="font-medium">{retentionData.day7}%</span>
                  </div>
                  <Progress value={retentionData.day7} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Day 30 Retention</span>
                    <span className="font-medium">{retentionData.day30}%</span>
                  </div>
                  <Progress value={retentionData.day30} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Day 90 Retention</span>
                    <span className="font-medium">{retentionData.day90}%</span>
                  </div>
                  <Progress value={retentionData.day30} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Platform Engagement Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-green-500" />
                Platform Engagement
              </CardTitle>
              <CardDescription>Average time per session: 18 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureEngagement.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{item.feature}</span>
                      </div>
                      <span className="text-sm font-medium">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* User Stats Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Top Earners Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Top Earning Users
              </CardTitle>
              <CardDescription>Users with highest earnings</CardDescription>
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
                      <div className="font-medium text-green-600">{user.earnings}</div>
                      <div className="text-muted-foreground">{user.followers.toLocaleString()} followers</div>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full mt-2" variant="outline">View All Users</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Most Gifted Users Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Crown className="h-5 w-5 mr-2 text-purple-500" />
                Most Gifted Users
              </CardTitle>
              <CardDescription>Users receiving most gifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mostGiftedUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {index + 1}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="text-sm text-right">
                      <div className="font-medium text-purple-600">{user.giftsReceived} gifts</div>
                      <div className="text-muted-foreground">{user.giftValue}</div>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full mt-2" variant="outline">View Gift Analytics</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Revenue Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                Revenue Statistics
              </CardTitle>
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
