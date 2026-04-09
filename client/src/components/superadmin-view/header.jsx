import { AlignJustify, LogOut, Crown, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";

function SuperAdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/auth/login");
  }

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 py-4 sticky top-0 z-30"
      style={{
        background: "rgba(15,12,41,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Mobile hamburger */}
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="lg:hidden rounded-lg"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        <AlignJustify className="w-5 h-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      {/* Title strip */}
      <div className="flex items-center gap-2 lg:ml-0 ml-2">
        <Crown className="w-4 h-4" style={{ color: "#f59e0b" }} />
        <span
          className="text-sm font-semibold tracking-wide hidden sm:block"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Super Admin Panel
        </span>
      </div>

      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg relative"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 text-white text-xs rounded-full flex items-center justify-center"
            style={{ background: "#f59e0b", fontSize: "10px" }}
          >
            !
          </span>
        </Button>

        {/* User */}
        <div
          className="flex items-center gap-3 pl-4"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.12)" }}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">
              {user?.userName || "Super Admin"}
            </p>
            <p className="text-xs" style={{ color: "#f59e0b" }}>
              Super Administrator
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
            }}
          >
            {user?.userName ? user.userName.charAt(0).toUpperCase() : "S"}
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="icon"
          className="rounded-lg transition-colors"
          style={{ color: "rgba(248,113,113,0.7)" }}
          title="Sign Out"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.12)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(248,113,113,0.7)";
          }}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}

export default SuperAdminHeader;
