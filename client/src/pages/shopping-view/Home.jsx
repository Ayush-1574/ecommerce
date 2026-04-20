import {
  Airplay, BabyIcon, ChevronLeftIcon, ChevronRightIcon,
  CloudLightning, Heater, Images, Shirt, ShirtIcon,
  ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon,
  ArrowRight, Zap, Star, TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/ShoppingProductile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchSiteConfig } from "@/store/siteconfig-slice";

// ─── Icon maps (kept client-side; only IDs travel through the DB) ────────────
const CATEGORY_ICONS = {
  men:         { icon: ShirtIcon,      color: "from-blue-500 to-cyan-500",    bg: "bg-blue-50" },
  women:       { icon: CloudLightning, color: "from-pink-500 to-rose-500",    bg: "bg-pink-50" },
  kids:        { icon: BabyIcon,       color: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
  accessories: { icon: WatchIcon,      color: "from-violet-500 to-purple-500",bg: "bg-violet-50" },
  footwear:    { icon: UmbrellaIcon,   color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
};
const DEFAULT_CAT = { icon: ShoppingBasket, color: "from-slate-500 to-slate-700", bg: "bg-slate-50" };

const BRAND_ICONS = {
  nike:   { icon: Shirt,         color: "from-slate-700 to-slate-900" },
  adidas: { icon: WashingMachine,color: "from-black to-gray-800" },
  puma:   { icon: ShoppingBasket,color: "from-red-600 to-red-800" },
  levi:   { icon: Airplay,       color: "from-blue-700 to-blue-900" },
  zara:   { icon: Images,        color: "from-zinc-700 to-zinc-900" },
  "h&m":  { icon: Heater,        color: "from-rose-600 to-rose-800" },
};
const DEFAULT_BRAND = { icon: ShoppingBasket, color: "from-gray-700 to-gray-900" };

const HIGHLIGHT_ICONS = [
  { icon: Zap,       color: "text-amber-500" },
  { icon: Star,      color: "text-violet-500" },
  { icon: TrendingUp,color: "text-emerald-500" },
];

// ─── Defaults (shown while config loads) ─────────────────────────────────────
const DEFAULT_HERO = {
  badge: "New Season Sale",
  title: "Discover Your",
  titleAccent: "Signature Style",
  subtitle: "Shop the latest trends across fashion, accessories, footwear and more — all in one place.",
};
const DEFAULT_CTA = {
  badge: "Limited Time Offer",
  title: "Get 20% Off Your First Purchase",
  desc: "New to ShopVerse? Sign up and enjoy an exclusive welcome discount on your first order.",
  buttonText: "Shop the Collection",
};

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { config } = useSelector((state) => state.siteconfig);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Pull dynamic config ──
  const hero       = config?.hero       || DEFAULT_HERO;
  const categories = config?.categories || [];
  const brands     = config?.brands     || [];
  const highlights = config?.highlights || [];
  const cta        = config?.cta        || DEFAULT_CTA;

  function handleNavigateToListingPage(item, section) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [item.id] }));
    navigate("/shop/listing");
  }

  function handleGetProductDetails(id) { dispatch(fetchProductDetails(id)); }

  function handleAddtoCart(productId) {
    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast("Product added to cart!");
      }
    });
  }

  useEffect(() => { if (productDetails !== null) setOpenDetailsDialog(true); }, [productDetails]);

  useEffect(() => {
    if (!featureImageList?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
    dispatch(getFeatureImages());
    dispatch(fetchSiteConfig());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Hero Banner ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "clamp(420px, 72vh, 680px)" }}>

        {featureImageList?.length > 0
          ? featureImageList.map((slide, index) => (
              <div key={index} className="absolute inset-0 transition-all duration-1000 ease-in-out" style={{ opacity: index === currentSlide ? 1 : 0 }}>
                <img src={slide?.image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" style={{ filter: "brightness(0.45) saturate(1.1)" }} />
              </div>
            ))
          : <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }} />
        }

        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 38%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.5) 100%)" }} />

        {/* Text card */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-lg rounded-3xl p-8 sm:p-10" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))", border: "1px solid rgba(245,158,11,0.4)", color: "#fbbf24" }}>
                  <Zap className="w-3 h-3 fill-current" />
                  {hero.badge}
                </span>
              </div>
              <h1 className="font-black leading-[1.08] tracking-tight mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                {hero.title}
                <span className="block" style={{ background: "linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {hero.titleAccent}
                </span>
              </h1>
              <p className="text-sm sm:text-base leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.72)", maxWidth: "38ch" }}>
                {hero.subtitle}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => navigate("/shop/listing")} className="flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", boxShadow: "0 8px 24px rgba(124,58,237,0.45)" }}>
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate("/shop/search")} className="font-semibold px-5 py-3 rounded-xl transition-all duration-200" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "white", backdropFilter: "blur(8px)" }}>
                  Explore
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        {featureImageList?.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {featureImageList.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} className="rounded-full transition-all duration-300"
                style={{ width: i === currentSlide ? "24px" : "8px", height: "8px", background: i === currentSlide ? "#fff" : "rgba(255,255,255,0.35)" }} />
            ))}
          </div>
        )}

        {/* Arrows */}
        {featureImageList?.length > 1 && (
          <>
            <button onClick={() => setCurrentSlide((p) => (p - 1 + featureImageList.length) % featureImageList.length)}
              className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)" }}>
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentSlide((p) => (p + 1) % featureImageList.length)}
              className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)" }}>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter */}
        {featureImageList?.length > 1 && (
          <div className="absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
            {currentSlide + 1} / {featureImageList.length}
          </div>
        )}
      </section>

      {/* ── Highlights Bar ── */}
      {highlights.length > 0 && (
        <section className="border-y bg-muted/20">
          <div className="container mx-auto px-4">
            <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(highlights.length, 4)} divide-y sm:divide-y-0 sm:divide-x`}>
              {highlights.map((h, i) => {
                const { icon: Icon, color } = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
                return (
                  <div key={h.id || i} className="flex items-center gap-4 px-6 py-5 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm border">
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{h.label}</p>
                      <p className="text-xs text-muted-foreground">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Shop by Category ── */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Collections</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Shop by Category</h2>
              </div>
              <button onClick={() => navigate("/shop/listing")} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline underline-offset-4">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${Math.min(categories.length, 5)} gap-4`}>
              {categories.map((cat) => {
                const style = CATEGORY_ICONS[cat.id] || DEFAULT_CAT;
                const Icon = style.icon;
                return (
                  <Card key={cat.id} onClick={() => handleNavigateToListingPage(cat, "category")}
                    className="cursor-pointer group border hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1.5 bg-card">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                      <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center shadow`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <span className="font-bold text-sm mb-1">{cat.label}</span>
                      <span className="text-xs text-muted-foreground">{cat.count} items</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Shop by Brand ── */}
      {brands.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Brands</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Top Brands</h2>
              </div>
            </div>
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${Math.min(brands.length, 6)} gap-4`}>
              {brands.map((brand) => {
                const style = BRAND_ICONS[brand.id] || DEFAULT_BRAND;
                const Icon = style.icon;
                return (
                  <Card key={brand.id} onClick={() => handleNavigateToListingPage(brand, "brand")}
                    className="cursor-pointer group border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1.5">
                    <CardContent className="p-0">
                      <div className={`h-28 bg-gradient-to-br ${style.color} flex flex-col items-center justify-center gap-2 rounded-2xl`}>
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-bold text-white text-sm">{brand.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Our Picks</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Products</h2>
            </div>
            <button onClick={() => navigate("/shop/listing")} className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline underline-offset-4">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length > 0
              ? productList.map((p) => (
                  <ShoppingProductTile key={p.id} handleGetProductDetails={handleGetProductDetails} product={p} handleAddtoCart={handleAddtoCart} />
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
                {cta.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                {cta.title}
              </h2>
              <p className="text-white/80 text-base mb-8 max-w-md mx-auto">{cta.desc}</p>
              <button onClick={() => navigate("/shop/listing")}
                className="inline-flex items-center gap-2 bg-white text-violet-700 hover:bg-white/90 font-bold px-8 py-3 rounded-xl text-base shadow-xl hover:scale-105 transition-all">
                {cta.buttonText}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
  );
}

export default ShoppingHome;
