import {
  House,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice";

function MenuItems({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`))
      : navigate(getCurrentMenuItem.path);

    if (onClose) onClose();
  }

  const isActive = (item) => {
    if (item.id === "home") return location.pathname === "/shop/home";
    if (item.id === "products") return location.pathname === "/shop/listing";
    if (item.id === "search") return location.pathname === "/shop/search";
    return location.pathname.includes("listing") &&
      new URLSearchParams(location.search).get("category") === item.id;
  };

  return (
    <nav className="flex flex-col lg:items-center gap-1 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <button
          onClick={() => handleNavigate(menuItem)}
          className={`text-sm font-medium cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 text-left
            ${isActive(menuItem)
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          key={menuItem.id}
        >
          {menuItem.label}
        </button>
      ))}
    </nav>
  );
}

function HeaderRightContent({ onClose }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/auth/login");
    if (onClose) onClose();
  }

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, user, isAuthenticated]);

  const cartCount = cartItems?.items?.length || 0;

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-2">
      {/* Cart */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative rounded-full w-10 h-10 hover:bg-accent"
          aria-label="Open Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
              {cartCount}
            </span>
          )}
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items?.length > 0 ? cartItems.items : []}
        />
      </Sheet>

      {/* User */}
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                <span className="text-white font-bold text-sm">
                  {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user?.userName || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")} className="cursor-pointer">
              <UserCog className="mr-2 h-4 w-4" />
              My Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => navigate("/auth/login")} size="sm" className="rounded-lg font-semibold">
          Sign In
        </Button>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b bg-background/95 backdrop-blur-lg shadow-sm"
          : "bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 gap-4">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 group-hover:scale-110 transition-transform shadow-md">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-violet-600 to-indigo-700 bg-clip-text text-transparent">
            ShopVerse
          </span>
        </Link>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs pt-12">
            <div className="flex items-center gap-2.5 mb-8 px-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-md">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-violet-600 to-indigo-700 bg-clip-text text-transparent">
                ShopVerse
              </span>
            </div>
            <div className="space-y-6">
              <MenuItems onClose={() => setMobileMenuOpen(false)} />
              <div className="border-t pt-4">
                <HeaderRightContent onClose={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <MenuItems />
        </div>

        {/* Right Content */}
        <div className="hidden lg:flex items-center gap-2">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
