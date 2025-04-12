
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-bold text-shama-primary mb-4">404</h1>
        <p className="text-xl mb-4">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-muted-foreground mb-8">
          The path <span className="font-mono bg-muted px-2 py-1 rounded">{location.pathname}</span> could not be found.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate("/dashboard")} className="bg-shama-primary hover:bg-shama-primary/90 gap-2">
            <LayoutDashboard size={18} />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
