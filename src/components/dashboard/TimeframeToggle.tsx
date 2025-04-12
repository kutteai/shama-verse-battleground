
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TimeframeToggleProps {
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
}

const TimeframeToggle = ({ timeframe, setTimeframe }: TimeframeToggleProps) => {
  return (
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
};

export default TimeframeToggle;
