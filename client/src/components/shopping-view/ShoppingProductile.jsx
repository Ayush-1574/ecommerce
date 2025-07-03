import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function ShoppingProductTile({ product }) {
  return (
    <Card className="overflow-hidden">
      <div>
        <div className="relative">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          {product.salePrice > 0 && (
            <Badge className="absolute top-2 left-2">Sale</Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-1">
          <h2 className="text-base font-medium truncate">{product.title}</h2>
          <div className="flex flex-col text-sm text-gray-600">
            <span className={product.salePrice > 0 ? "line-through" : ""}>
              ₹{product.price}
            </span>
            {product.salePrice > 0 && (
              <span className="text-green-600 font-semibold">
                ₹{product.salePrice}
              </span>
            )}
            <span className="capitalize">{product.category}</span>
            <span>{product.brand}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4">
          <Button className="w-full">Add to Cart</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;
