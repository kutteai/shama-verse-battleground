
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <h1 className="text-6xl font-bold text-shama-primary mb-4">404</h1>
      <p className="text-xl mb-8 text-center">Oops! The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate("/dashboard")} className="bg-shama-primary hover:bg-shama-primary/90">
        Return to Dashboard
      </Button>
    </div>
  );
};

export default NotFound;
