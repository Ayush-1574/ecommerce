import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";

const navItems = [
  { id: "home", label: "Home" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
  { id: "footwear", label: "Footwear" },
  { id: "accessories", label: "Accessories" }
];

function HeaderRightContent() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="flex items-center gap-4">
      {/* Cart Button */}
      <Button variant="outline" size="icon">
        <ShoppingCart className="w-6 h-6" />
        <span className="sr-only">User Cart</span>
      </Button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarFallback>
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>
            Logged in as {user?.userName || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/shop/home"
          className="flex items-center gap-2 text-gray-800 hover:text-black transition"
        >
          <HousePlug className="w-6 h-6" />
          <span className="text-lg font-bold tracking-wide">Ecommerce</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={`/shop/listing?category=${item.id}`}
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Auth Content (Cart, Avatar) */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-left">Browse</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/shop/listing?category=${item.id}`}
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-6">
                <HeaderRightContent />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
