import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { ShoppingCart } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="group w-full max-w-sm mx-auto overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-card">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-sm hover:bg-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              Only {product?.totalStock} left
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm hover:bg-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {product?.title}
          </h2>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span
              className={`${
                product?.salePrice > 0
                  ? "line-through text-muted-foreground text-sm"
                  : "text-primary text-lg"
              } font-bold`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button
            className="w-full rounded-xl opacity-50 cursor-not-allowed"
            disabled
          >
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full rounded-xl gap-2 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
