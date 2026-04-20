import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { applyCoupon, clearAppliedCoupon } from "@/store/shop/coupon-slice";
import { toast } from "sonner";
import { CreditCard, Ticket, X } from "lucide-react";
import { Input } from "@/components/ui/input";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { appliedCoupon, isLoading: isApplyingCoupon } = useSelector((state) => state.shopCoupon);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const finalCartAmount = appliedCoupon 
    ? Math.max(0, totalCartAmount - appliedCoupon.discountAmount)
    : totalCartAmount;

  function handleApplyCoupon() {
    if (!couponCode.trim()) {
      toast("Please enter a valid coupon code");
      return;
    }
    dispatch(applyCoupon({ code: couponCode, cartTotalAmount: totalCartAmount }))
      .then((data) => {
        if (data?.payload?.success) {
          toast(`Coupon applied! You saved $${data.payload.data.discountAmount}`);
        } else {
          toast(data?.payload?.message || "Invalid or expired coupon");
        }
      });
  }

  function handleClearCoupon() {
    dispatch(clearAppliedCoupon());
    setCouponCode("");
    toast("Coupon removed");
  }

  function handleInitiatePaypalPayment() {
    if (cartItems.length === 0) {
      toast("Your cart is empty. Please add items to proceed");
      return;
    }
    if (currentSelectedAddress === null) {
      toast("Please select one address to proceed.");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?.id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?.id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: finalCartAmount,
      couponCode: appliedCoupon?.code || null,
      discountAmount: appliedCoupon?.discountAmount || 0,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[200px] sm:h-[250px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              Checkout
            </h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="bg-card rounded-2xl border shadow-sm p-5 space-y-4">
              {cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items.map((item) => (
                    <UserCartItemsContent key={item.productId} cartItem={item} />
                  ))
                : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No items in cart
                  </p>
                )}
              {cartItems?.items?.length > 0 && (
                <>
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex px-1 gap-2 items-center">
                      <Input 
                        placeholder="Enter coupon code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={appliedCoupon}
                        className="flex-1"
                      />
                      {appliedCoupon ? (
                        <Button variant="outline" size="icon" onClick={handleClearCoupon}>
                           <X className="w-4 h-4 text-red-500" />
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleApplyCoupon} 
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          variant="secondary"
                        >
                           <Ticket className="w-4 h-4 mr-2" />
                           Apply
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-2">
                       <div className="flex justify-between items-center text-muted-foreground">
                         <span>Subtotal</span>
                         <span>${totalCartAmount.toFixed(2)}</span>
                       </div>
                       
                       {appliedCoupon && (
                         <div className="flex justify-between items-center text-green-600 font-medium">
                           <span>Discount ({appliedCoupon.code})</span>
                           <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                         </div>
                       )}

                       <div className="flex justify-between items-center pt-2 border-t">
                         <span className="font-bold">Total</span>
                         <span className="text-xl font-bold">${finalCartAmount.toFixed(2)}</span>
                       </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleInitiatePaypalPayment}
                    className="w-full rounded-xl h-12 font-semibold gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CreditCard className="w-4 h-4" />
                    {isPaymentStart
                      ? "Processing Payment..."
                      : `Pay $${finalCartAmount.toFixed(2)} with Paypal`}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
