import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuperadminStats,
  fetchAllUsers,
} from "@/store/superadmin-slice";
import {
  Crown,
  Users,
  ShieldCheck,
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  UserPlus,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, gradient, glow }) {
  return (
    <div
      className="rounded-2xl p-6 flex items-start gap-5 transition-transform duration-200 hover:-translate-y-1"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.25)`,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: gradient,
          boxShadow: glow,
        }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
          {label}
        </p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const { stats, users, isLoading } = useSelector((state) => state.superadmin);

  useEffect(() => {
    dispatch(fetchSuperadminStats());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      sub: "Registered shoppers",
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
      glow: "0 4px 14px rgba(59,130,246,0.4)",
    },
    {
      icon: ShieldCheck,
      label: "Total Admins",
      value: stats?.totalAdmins ?? "—",
      sub: "Active administrators",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      glow: "0 4px 14px rgba(245,158,11,0.4)",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: stats?.totalOrders ?? "—",
      sub: "All time orders",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      glow: "0 4px 14px rgba(16,185,129,0.4)",
    },
    {
      icon: Package,
      label: "Total Products",
      value: stats?.totalProducts ?? "—",
      sub: "Current catalogue",
      gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      glow: "0 4px 14px rgba(139,92,246,0.4)",
    },
  ];

  const recentUsers = stats?.recentUsers || [];

  const roleColor = (role) => {
    if (role === "superadmin") return { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" };
    if (role === "admin") return { bg: "rgba(139,92,246,0.15)", text: "#a78bfa" };
    return { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" };
  };

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <Crown className="w-6 h-6" style={{ color: "#f59e0b" }} />
        <div>
          <h1 className="text-2xl font-bold text-white">Overview Dashboard</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Platform-wide metrics at a glance
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl h-36 animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>
      )}

      {/* Recent Users */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <h2 className="text-base font-semibold text-white">
              Recently Joined Users
            </h2>
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Last 5 registrations
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Username", "Email", "Role", "Joined"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-6 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                recentUsers.map((u) => {
                  const rc = roleColor(u.role);
                  return (
                    <tr
                      key={u.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                            style={{
                              background:
                                "linear-gradient(135deg, #302b63, #24243e)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            {u.userName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span className="text-sm font-medium text-white">
                            {u.userName}
                          </span>
                        </div>
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        {u.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                          style={{
                            background: rc.bg,
                            color: rc.text,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
