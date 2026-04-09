import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import { Sparkles, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ShoppingHeader />

      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300">
        {/* Top Section */}
        <div className="container mx-auto px-4 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg">
                  <Sparkles className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
                </div>
                <span className="font-extrabold text-xl text-white tracking-tight">ShopVerse</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                Your premium shopping destination for the latest fashion, electronics, accessories and more — all in one place.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {["fb", "tw", "ig", "yt"].map((s) => (
                  <button
                    key={s}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-violet-600 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-white transition-all duration-200 uppercase"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Shop</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {["Men's Fashion", "Women's Style", "Kids & Baby", "Accessories", "Footwear"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-violet-400 transition-colors flex items-center gap-1 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Support</h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                {["Help Center", "Shipping Policy", "Returns & Refunds", "Track Your Order", "Privacy Policy", "Terms of Service"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-violet-400 transition-colors flex items-center gap-1 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  support@shopverse.com
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  +1 (800) 123-4567
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  123 Commerce St, San Francisco, CA 94102
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} ShopVerse. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-3 bg-blue-700 rounded-sm text-white text-[8px] font-bold flex items-center justify-center">V</span>
                Visa
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-3 bg-red-600 rounded-sm text-white text-[8px] font-bold flex items-center justify-center">M</span>
                Mastercard
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-3 bg-blue-500 rounded-sm text-white text-[8px] font-bold flex items-center justify-center">P</span>
                PayPal
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingLayout;
