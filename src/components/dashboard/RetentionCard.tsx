
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Monitor } from "lucide-react";

interface RetentionDataProps {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

interface RetentionCardProps {
  data: RetentionDataProps;
}

const RetentionCard = ({ data }: RetentionCardProps) => {
  return (
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
              <span className="font-medium">{data.day1}%</span>
            </div>
            <Progress value={data.day1} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Day 7 Retention</span>
              <span className="font-medium">{data.day7}%</span>
            </div>
            <Progress value={data.day7} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Day 30 Retention</span>
              <span className="font-medium">{data.day30}%</span>
            </div>
            <Progress value={data.day30} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Day 90 Retention</span>
              <span className="font-medium">{data.day90}%</span>
            </div>
            <Progress value={data.day90} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetentionCard;
