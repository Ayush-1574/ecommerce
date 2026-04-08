import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-white font-bold text-lg">ShopVerse</h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Your premium shopping destination for the latest fashion, electronics, and more.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-white transition-colors cursor-pointer">FAQs</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white transition-colors cursor-pointer">Shipping Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Returns</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} ShopVerse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingLayout;
