import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { ShoppingCart, Eye, Star } from "lucide-react";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  const discount = product?.salePrice > 0
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Card className="group w-full overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-card hover:-translate-y-1">
      {/* Image */}
      <div
        onClick={() => handleGetProductDetails(product?.id)}
        className="cursor-pointer relative overflow-hidden"
      >
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[240px] object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              variant="secondary"
              size="sm"
              className="backdrop-blur-sm bg-white/90 hover:bg-white text-gray-900 font-semibold rounded-full px-4 shadow-lg"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product?.totalStock === 0 ? (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Sold Out
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Low Stock
            </Badge>
          ) : null}

          {discount > 0 && (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist / star */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          onClick={(e) => e.stopPropagation()}
        >
          <Star className="w-4 h-4 text-gray-400 hover:text-amber-400 transition-colors" />
        </button>
      </div>

      {/* Content */}
      <CardContent className="p-4 pb-3">
        <h2
          className="text-sm font-bold line-clamp-1 mb-1.5 group-hover:text-primary transition-colors cursor-pointer"
          onClick={() => handleGetProductDetails(product?.id)}
        >
          {product?.title}
        </h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            {categoryOptionsMap[product?.category]}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">
            {brandOptionsMap[product?.brand]}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          {product?.salePrice > 0 ? (
            <>
              <span className="text-lg font-extrabold text-primary">
                ${product?.salePrice}
              </span>
              <span className="text-sm line-through text-muted-foreground">
                ${product?.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-extrabold text-primary">
              ${product?.price}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button
            className="w-full rounded-xl text-sm font-semibold opacity-50 cursor-not-allowed"
            disabled
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?.id, product?.totalStock)}
            className="w-full rounded-xl text-sm font-semibold gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
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
