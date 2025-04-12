
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ErrorLog {
  id: string;
  timestamp: string;
  errorCode: string;
  message: string;
  source: string;
  deviceInfo: {
    os: string;
    browser: string;
    appVersion: string;
  };
  severity: "low" | "medium" | "high" | "critical";
}

interface ErrorLoggingProps {
  errors: ErrorLog[];
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-yellow-100 text-yellow-800";
    case "medium":
      return "bg-orange-100 text-orange-800";
    case "high":
      return "bg-red-100 text-red-800";
    case "critical":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ErrorLogging = ({ errors }: ErrorLoggingProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Error Logging Dashboard
        </CardTitle>
        <CardDescription>
          Monitor application errors and exceptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {errors.length === 0 ? (
            <div className="text-center py-8">
              <Code className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No errors logged</p>
            </div>
          ) : (
            errors.map((error) => (
              <div key={error.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium flex items-center">
                      <Badge className={getSeverityColor(error.severity)}>
                        {error.severity.toUpperCase()}
                      </Badge>
                      <span className="ml-2">{error.errorCode}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{error.timestamp}</p>
                  </div>
                  <Badge variant="outline">
                    {error.source}
                  </Badge>
                </div>
                <p className="text-sm mt-1 p-2 bg-muted font-mono rounded">{error.message}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {error.deviceInfo.os}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {error.deviceInfo.browser}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    v{error.deviceInfo.appVersion}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorLogging;
