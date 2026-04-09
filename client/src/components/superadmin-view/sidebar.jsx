import { Fragment } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BarChart3,
  LogOut,
  Crown,
  UserCog,
  Images,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/superadmin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "users",
    label: "All Users",
    path: "/superadmin/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "admins",
    label: "Manage Admins",
    path: "/superadmin/admins",
    icon: <UserCog className="w-5 h-5" />,
  },
  {
    id: "carousel",
    label: "Carousel Banners",
    path: "/superadmin/carousel",
    icon: <Images className="w-5 h-5" />,
  },
];

function SuperAdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <Fragment>
      <aside
        className="hidden w-72 flex-col lg:flex"
        style={{
          background: "linear-gradient(160deg, #0f0c29, #302b63, #24243e)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-6 py-6 cursor-pointer"
          onClick={() => navigate("/superadmin/dashboard")}
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
            }}
          >
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">ShopVerse</h2>
            <p className="text-xs font-medium" style={{ color: "#f59e0b" }}>
              Super Admin
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3 px-3"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Control Panel
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 w-full text-left transition-all duration-200"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.15))"
                    : "transparent",
                  color: isActive ? "#f59e0b" : "rgba(255,255,255,0.65)",
                  border: isActive
                    ? "1px solid rgba(245,158,11,0.3)"
                    : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                  }
                }}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "#f59e0b" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div
          className="px-4 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-3 w-full text-left transition-all duration-200"
            style={{ color: "rgba(248,113,113,0.8)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.12)";
              e.currentTarget.style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(248,113,113,0.8)";
            }}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </Fragment>
  );
}

export default SuperAdminSidebar;
