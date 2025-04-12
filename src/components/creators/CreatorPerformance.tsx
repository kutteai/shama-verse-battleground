
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
  creator: Creator;
}

const CreatorPerformance = ({ creator }: CreatorPerformanceProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center">
                {creator.name}
                {creator.verified && (
                  <Badge className="ml-2 bg-blue-500">
                    <Award className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>@{creator.username}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Top Creator
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Total Earnings</p>
            <p className="text-xl font-bold">${creator.stats.earnings.toLocaleString()}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Upload Frequency</p>
            <p className="text-xl font-bold">{creator.stats.uploadFrequency}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-xl font-bold">{creator.stats.winRate}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-xs text-muted-foreground">Fan Engagement</p>
            <p className="text-xl font-bold">{creator.stats.fanEngagement}</p>
          </div>
        </div>

        <Tabs defaultValue="earnings">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          <TabsContent value="earnings">
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={creator.earningsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="engagement">
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={creator.engagementData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CreatorPerformance;
