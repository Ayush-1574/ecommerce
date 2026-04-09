import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/ShoppingProductile.jsx";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, PackageSearch } from "lucide-react";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword)).finally(() => setIsSearching(false));
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added`);
          return;
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast("Product added to cart!");
        }
      }
    );
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="border-b bg-gradient-to-br from-violet-50 via-background to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Find Your Perfect Product
          </h1>
          <p className="text-muted-foreground mb-8">Search across thousands of items</p>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {isSearching ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <Input
              value={keyword}
              name="keyword"
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-12 h-14 rounded-2xl text-base border-2 border-muted-foreground/20 focus:border-primary bg-background shadow-sm transition-all"
              placeholder="Search for products, brands, categories..."
              autoFocus
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {keyword.trim().length > 0 && keyword.trim().length <= 3 && (
            <p className="text-xs text-muted-foreground mt-3">
              Type at least 4 characters to search
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-10">
        {/* Results Header */}
        {keyword.trim().length > 3 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground font-medium">
              {searchResults.length > 0
                ? `Found ${searchResults.length} result${searchResults.length > 1 ? "s" : ""} for "${keyword}"`
                : `No results for "${keyword}"`}
            </p>
          </div>
        )}

        {/* Empty State */}
        {keyword.trim().length > 3 && !isSearching && !searchResults.length && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <PackageSearch className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              We couldn't find anything for "{keyword}". Try different keywords or check your spelling.
            </p>
          </div>
        )}

        {/* Default Empty (no search yet) */}
        {!keyword.trim() && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <Search className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-base font-semibold mb-1 text-muted-foreground">Start typing to search</h3>
            <p className="text-sm text-muted-foreground/70">Your results will appear here</p>
          </div>
        )}

        {/* Product Grid */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((item) => (
              <ShoppingProductTile
                key={item.id}
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
