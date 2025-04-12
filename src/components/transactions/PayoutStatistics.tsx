
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MinusCircle } from "lucide-react";
import { PayoutStats } from "@/types/transactions";
import { format } from "date-fns";

interface PayoutStatisticsProps {
  data: PayoutStats;
}

export const PayoutStatistics = ({ data }: PayoutStatisticsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MinusCircle className="h-5 w-5 mr-2 text-red-500" />
          Payout Statistics
        </CardTitle>
        <CardDescription>Current month payout data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Paid Out</div>
            <div className="text-3xl font-bold">{formatCurrency(data.total_paid)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Pending Payouts</div>
              <div className="text-xl font-bold">{formatCurrency(data.pending_payouts)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Average Payout</div>
              <div className="text-xl font-bold">{formatCurrency(data.average_payout)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Users Paid</div>
              <div className="text-xl font-bold">{data.users_paid}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Next Scheduled</div>
              <div className="text-sm font-medium">{formatDate(data.next_scheduled)}</div>
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
        <Button size="sm">Schedule Payouts</Button>
      </CardFooter>
    </Card>
  );
};
