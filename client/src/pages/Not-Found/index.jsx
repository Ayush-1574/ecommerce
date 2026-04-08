import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <FileQuestion className="w-10 h-10 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-primary">404</h1>
          <p className="text-xl font-semibold">Page Not Found</p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button
          className="rounded-xl h-11 px-8"
          onClick={() => navigate("/shop/home")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
