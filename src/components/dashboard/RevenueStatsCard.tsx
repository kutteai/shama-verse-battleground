
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Gift, TrendingUp, Award } from "lucide-react";

const RevenueStatsCard = () => {
  return (
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
  );
};

export default RevenueStatsCard;
