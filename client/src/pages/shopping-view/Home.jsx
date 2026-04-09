import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  ArrowRight,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/ShoppingProductile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men's Fashion", icon: ShirtIcon, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-950/30", count: "240+" },
  { id: "women", label: "Women's Style", icon: CloudLightning, color: "from-pink-500 to-rose-500", bg: "bg-pink-50 dark:bg-pink-950/30", count: "380+" },
  { id: "kids", label: "Kids & Baby", icon: BabyIcon, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/30", count: "120+" },
  { id: "accessories", label: "Accessories", icon: WatchIcon, color: "from-violet-500 to-purple-500", bg: "bg-violet-50 dark:bg-violet-950/30", count: "95+" },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-950/30", count: "160+" },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt, tagline: "Just Do It", color: "from-slate-700 to-slate-900" },
  { id: "adidas", label: "Adidas", icon: WashingMachine, tagline: "Impossible Is Nothing", color: "from-black to-gray-800" },
  { id: "puma", label: "Puma", icon: ShoppingBasket, tagline: "Forever Faster", color: "from-red-600 to-red-800" },
  { id: "levi", label: "Levi's", icon: Airplay, tagline: "Quality Never Basic", color: "from-blue-700 to-blue-900" },
  { id: "zara", label: "Zara", icon: Images, tagline: "Defining Trends", color: "from-zinc-700 to-zinc-900" },
  { id: "h&m", label: "H&M", icon: Heater, tagline: "Fashion & Quality", color: "from-rose-600 to-rose-800" },
];

const highlights = [
  { icon: Zap, label: "Flash Deals", desc: "Up to 70% off today", color: "text-amber-500" },
  { icon: Star, label: "Top Rated", desc: "4.5+ star products", color: "text-violet-500" },
  { icon: TrendingUp, label: "Trending Now", desc: "What's hot this week", color: "text-emerald-500" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast("Product added to cart!");
        }
      });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (!featureImageList?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden">
        {featureImageList?.length > 0
          ? featureImageList.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              >
                <img
                  src={slide?.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800" />
          )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Hero Text */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  New Season Sale
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg mb-4">
                Discover Your
                <span className="block bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                  Signature Style
                </span>
              </h1>
              <p className="text-white/80 text-base sm:text-lg mb-6 max-w-md leading-relaxed">
                Shop the latest trends across fashion, accessories, footwear and more — all in one place.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate("/shop/listing")}
                  className="bg-white text-gray-900 hover:bg-white/90 font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={() => navigate("/shop/search")}
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        {featureImageList?.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {featureImageList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* Arrow controls */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCurrentSlide((p) => (p - 1 + featureImageList.length) % featureImageList.length)
          }
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white rounded-full w-10 h-10"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCurrentSlide((p) => (p + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white rounded-full w-10 h-10"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </section>

      {/* ── Highlights Bar ── */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
            {highlights.map(({ icon: Icon, label, desc, color }) => (
              <div
                key={label}
                className="flex items-center gap-4 px-6 py-5 hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm border`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Collections</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Shop by Category</h2>
            </div>
            <button
              onClick={() => navigate("/shop/listing")}
              className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline underline-offset-4"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                className="cursor-pointer group border hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1.5 bg-card"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className={`w-14 h-14 rounded-2xl ${categoryItem.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${categoryItem.color} flex items-center justify-center shadow`}>
                      <categoryItem.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="font-bold text-sm mb-1">{categoryItem.label}</span>
                  <span className="text-xs text-muted-foreground">{categoryItem.count} items</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Brand ── */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Brands</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Top Brands</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer group border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1.5"
              >
                <CardContent className="p-0">
                  <div className={`h-28 bg-gradient-to-br ${brandItem.color} flex flex-col items-center justify-center gap-2 rounded-2xl`}>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <brandItem.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-white text-sm">{brandItem.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Our Picks</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Products</h2>
            </div>
            <button
              onClick={() => navigate("/shop/listing")}
              className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline underline-offset-4"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem.id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 p-10 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            </div>
            <div className="relative z-10">
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm border border-white/20">
                Limited Time Offer
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                Get 20% Off Your<br />First Purchase
              </h2>
              <p className="text-white/80 text-base mb-8 max-w-md mx-auto">
                New to ShopVerse? Sign up and enjoy an exclusive welcome discount on your first order.
              </p>
              <Button
                onClick={() => navigate("/shop/listing")}
                className="bg-white text-violet-700 hover:bg-white/90 font-bold px-8 py-3 rounded-xl text-base shadow-xl hover:scale-105 transition-all"
              >
                Shop the Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
