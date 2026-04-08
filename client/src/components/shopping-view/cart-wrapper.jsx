import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingBag } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md flex flex-col">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Your Cart
          {cartItems.length > 0 && (
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-auto mt-6 space-y-3">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Your cart is empty</p>
          </div>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="border-t pt-4 mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-xl font-bold">${totalCartAmount.toFixed(2)}</span>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full rounded-xl h-11 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
