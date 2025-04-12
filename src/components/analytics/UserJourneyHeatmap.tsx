
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

interface HeatmapCell {
  stage: string;
  value: number;
  color: string;
}

interface HeatmapRow {
  name: string;
  cells: HeatmapCell[];
}

interface UserJourneyHeatmapProps {
  data: HeatmapRow[];
}

const UserJourneyHeatmap = ({ data }: UserJourneyHeatmapProps) => {
  const stages = [
    "Signup",
    "View",
    "Like",
    "Follow",
    "Message",
    "Gift"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Map className="h-5 w-5 mr-2 text-amber-500" />
          User Journey Heatmap
        </CardTitle>
        <CardDescription>
          Conversion rates across different user journey stages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-7 gap-1 mb-2">
              <div className="p-2 text-sm font-medium">User Group</div>
              {stages.map(stage => (
                <div key={stage} className="p-2 text-sm font-medium text-center">
                  {stage}
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {data.map((row) => (
                <div key={row.name} className="grid grid-cols-7 gap-1">
                  <div className="p-2 text-sm font-medium bg-muted/50 flex items-center">
                    {row.name}
                  </div>
                  {row.cells.map((cell) => (
                    <div 
                      key={`${row.name}-${cell.stage}`}
                      className="p-2 flex items-center justify-center rounded-sm"
                      style={{ backgroundColor: cell.color }}
                    >
                      <span className="text-sm font-medium text-white">
                        {cell.value}%
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-4 gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-200 rounded-sm mr-1"></div>
            <span className="text-xs">0-20%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-300 rounded-sm mr-1"></div>
            <span className="text-xs">21-40%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-300 rounded-sm mr-1"></div>
            <span className="text-xs">41-60%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-lime-400 rounded-sm mr-1"></div>
            <span className="text-xs">61-80%</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
            <span className="text-xs">81-100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserJourneyHeatmap;
