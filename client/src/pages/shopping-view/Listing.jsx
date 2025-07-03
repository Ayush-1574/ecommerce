import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductFilter from "@/components/shopping-view/Filter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { fetchAllProduct } from "@/store/admin/product-slice";
import ShoppingProductTile from "@/components/shopping-view/ShoppingProductile"; // Assuming this is the tile

const Listing = () => {
  const dispatch = useDispatch();
  //const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllProduct());
  }, [dispatch]);

  const handleSort = (option) => {
    console.log("Sort by:", option);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <aside className="w-full lg:w-1/4">
        <ProductFilter />
      </aside>

      <main className="w-full lg:w-3/4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Products</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{products?.length || 0} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowUpDownIcon className="w-4 h-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("price-asc")}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("price-desc")}>
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("newest")}>
                  Newest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((product) => (
            <ShoppingProductTile key={product._id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Listing;
