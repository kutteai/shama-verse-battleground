
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, ArrowUpRight } from "lucide-react";

export const ProcessingStatus = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
          Stripe Dashboard
        </CardTitle>
        <CardDescription>Payment processing status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Connected and Active</div>
              <div className="text-xs text-muted-foreground">Last synced: 5 minutes ago</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-sm">Processing Success Rate</div>
              <div className="font-medium">98.2%</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">Failed Transactions (24h)</div>
              <div className="font-medium">3</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">Average Processing Time</div>
              <div className="font-medium">1.2s</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-center">
        <Button className="w-full" variant="outline">
          Open Stripe Dashboard
          <ArrowUpRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};
