import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UnauthPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to view this page. Please sign in with the correct account.
          </p>
        </div>
        <Button
          className="rounded-xl h-11 px-8"
          onClick={() => navigate("/auth/login")}
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
}

export default UnauthPage;
