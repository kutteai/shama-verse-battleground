
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2 } from "lucide-react";

interface EngagementItemProps {
  feature: string;
  percentage: number;
}

interface EngagementCardProps {
  data: EngagementItemProps[];
}

const EngagementCard = ({ data }: EngagementCardProps) => {
  return (
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
          {data.map((item, index) => (
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
  );
};

export default EngagementCard;
