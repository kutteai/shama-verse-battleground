
import DashboardLayout from "@/components/layout/DashboardLayout";
import ErrorLogging from "@/components/system/ErrorLogging";
import ApiStatus from "@/components/system/ApiStatus";

// Define required types
interface ApiEndpoint {
  id: string;
  name: string;
  status: "operational" | "degraded" | "maintenance" | "outage";
  responseTime: number;
  uptime: string;
  lastIncident?: string;
}

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

const SystemTools = () => {
  // Mock API endpoints data with correct status types
  const apiEndpointsData: ApiEndpoint[] = [
    {
      id: "api_1",
      name: "Authentication API",
      status: "operational" as const,
      responseTime: 230,
      uptime: "99.99%",
    },
    {
      id: "api_2",
      name: "Video Processing API",
      status: "operational" as const,
      responseTime: 450,
      uptime: "99.95%",
    },
    {
      id: "api_3",
      name: "Analytics API",
      status: "operational" as const,
      responseTime: 180,
      uptime: "99.98%",
    },
    {
      id: "api_4",
      name: "Payment Processing API",
      status: "degraded" as const,
      responseTime: 850,
      uptime: "98.75%",
      lastIncident: "2025-04-08T10:15:00Z"
    },
    {
      id: "api_5",
      name: "Content Delivery Network",
      status: "operational" as const,
      responseTime: 120,
      uptime: "99.99%",
    }
  ];

  // Mock error logs data with correct severity types
  const errorLogsData: ErrorLog[] = [
    {
      id: "err_1",
      timestamp: "2025-04-11T14:30:25Z",
      errorCode: "AUTH_403",
      message: "User authentication failed: Invalid credentials",
      source: "/api/auth/login",
      deviceInfo: {
        os: "iOS 15.4",
        browser: "Safari",
        appVersion: "2.4.0"
      },
      severity: "medium" as const
    },
    {
      id: "err_2",
      timestamp: "2025-04-11T12:15:10Z",
      errorCode: "API_500",
      message: "Internal server error in payment processing",
      source: "/api/payments/process",
      deviceInfo: {
        os: "Android 12",
        browser: "Chrome",
        appVersion: "2.4.0"
      },
      severity: "high" as const
    },
    {
      id: "err_3",
      timestamp: "2025-04-11T10:05:33Z",
      errorCode: "CDN_404",
      message: "Video asset not found",
      source: "/api/videos/stream/v-12345",
      deviceInfo: {
        os: "Windows 11",
        browser: "Edge",
        appVersion: "2.3.9"
      },
      severity: "low" as const
    },
    {
      id: "err_4",
      timestamp: "2025-04-10T23:42:18Z",
      errorCode: "DB_CONN",
      message: "Database connection timeout",
      source: "/api/users/profile",
      deviceInfo: {
        os: "macOS 12.3",
        browser: "Chrome",
        appVersion: "2.4.0"
      },
      severity: "critical" as const
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Tools</h1>
          <p className="text-muted-foreground">Monitor system health, errors, and API status</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ApiStatus 
            endpoints={apiEndpointsData} 
            lastUpdated="2025-04-12T08:30:00Z"
          />
          
          <ErrorLogging errors={errorLogsData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemTools;
