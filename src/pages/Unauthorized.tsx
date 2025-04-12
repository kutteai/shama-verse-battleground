
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold text-shama-primary mb-4">Access Denied</h1>
      <p className="text-lg mb-6 text-center max-w-md">
        You don't have permission to access this area. Please contact a system administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button 
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
