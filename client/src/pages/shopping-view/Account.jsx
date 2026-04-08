import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[200px] sm:h-[250px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              My Account
            </h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-4 relative z-10 pb-8">
        <div className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders" className="rounded-lg">
                Orders
              </TabsTrigger>
              <TabsTrigger value="address" className="rounded-lg">
                Addresses
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
