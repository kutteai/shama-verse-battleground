
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApiEndpoint {
  id: string;
  name: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  responseTime: number; // in ms
  uptime: string; // percentage
  lastIncident?: string;
}

interface ApiStatusProps {
  endpoints: ApiEndpoint[];
  lastUpdated: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "degraded":
      return <Clock className="h-4 w-4 text-orange-500" />;
    case "outage":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "maintenance":
      return <Activity className="h-4 w-4 text-blue-500" />;
    default:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "operational":
      return "bg-green-100 text-green-800";
    case "degraded":
      return "bg-orange-100 text-orange-800";
    case "outage":
      return "bg-red-100 text-red-800";
    case "maintenance":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ApiStatus = ({ endpoints, lastUpdated }: ApiStatusProps) => {
  const allOperational = endpoints.every(endpoint => endpoint.status === "operational");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-500" />
          API Status
        </CardTitle>
        <CardDescription className="flex justify-between">
          <span>Monitor status of API endpoints and services</span>
          <span className="text-xs text-muted-foreground">Last updated: {lastUpdated}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 rounded-md border flex items-center justify-between">
          <div className="flex items-center">
            {allOperational ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <Activity className="h-5 w-5 text-amber-500 mr-2" />
            )}
            <span className="font-medium">
              {allOperational ? "All Systems Operational" : "Some Systems Experiencing Issues"}
            </span>
          </div>
          <Badge className={allOperational ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
            {allOperational ? "100%" : "Partial Outage"}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className="p-3 border rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(endpoint.status)}
                <span className="text-sm font-medium">{endpoint.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {endpoint.responseTime}ms
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {endpoint.uptime} uptime
                </Badge>
                <Badge className={`text-xs ${getStatusColor(endpoint.status)}`}>
                  {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiStatus;
