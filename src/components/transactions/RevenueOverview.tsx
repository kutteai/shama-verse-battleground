
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Gift, PlusCircle, Clock, RefreshCw } from "lucide-react";
import { RevenueData } from "@/types/transactions";

interface RevenueOverviewProps {
  data: RevenueData;
}

export const RevenueOverview = ({ data }: RevenueOverviewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-500" />
          Revenue Overview
        </CardTitle>
        <CardDescription>Current month revenue breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">
          {formatCurrency(data.total)}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Gift className="h-4 w-4 mr-2 text-purple-500" />
              <span>Gift Purchases</span>
            </div>
            <div>
              {formatCurrency(data.gift_purchases)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <PlusCircle className="h-4 w-4 mr-2 text-blue-500" />
              <span>Challenge Entries</span>
            </div>
            <div>
              {formatCurrency(data.challenge_entries)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span>Subscriptions</span>
            </div>
            <div>
              {formatCurrency(data.subscriptions)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span>Other Revenue</span>
            </div>
            <div>
              {formatCurrency(data.other)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Select defaultValue={data.timeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current_month">Current Month</SelectItem>
            <SelectItem value="previous_month">Previous Month</SelectItem>
            <SelectItem value="year_to_date">Year to Date</SelectItem>
            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
