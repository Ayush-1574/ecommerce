import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-md w-full text-center rounded-2xl border-0 shadow-lg p-8 sm:p-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
        </div>
        <CardHeader className="p-0 space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Payment Successful!
          </CardTitle>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order is being processed.
          </p>
        </CardHeader>
        <Button
          className="mt-8 rounded-xl h-11 px-8 font-semibold"
          onClick={() => navigate("/shop/account")}
        >
          View Orders
        </Button>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
