import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuperadminStats,
  fetchAllUsers,
  updateUserRole,
  deleteUser,
  resetUserPassword,
} from "@/store/superadmin-slice";
import {
  Crown,
  Users,
  ShieldCheck,
  Package,
  ShoppingCart,
  Clock,
  UserPlus,
  ArrowRight,
  Trash2,
  Key,
  ShieldAlert,
  ShieldEllipsis,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

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

function ResetPasswordModal({ open, onClose, userId, userName }) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleReset = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const res = await dispatch(resetUserPassword({ id: userId, password }));
    setLoading(false);
    if (resetUserPassword.fulfilled.match(res)) {
      toast.success(`Password updated for ${userName}`);
      onClose();
      setPassword("");
    } else {
      toast.error(res.payload || "Failed to reset password");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1730] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Reset Password</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <p className="text-sm text-white/50 mb-6">
          Forcing a password reset for <span className="text-[#f59e0b] font-bold">{userName}</span>.
        </p>
        <div className="relative mb-6">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#f59e0b]/50 transition-all"
          />
          <button
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
          >
            {show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-all">Cancel</button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? "Resetting..." : "Confirm Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, isLoading } = useSelector((state) => state.superadmin);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [resetModal, setResetModal] = useState({ open: false, id: null, name: "" });

  useEffect(() => {
    dispatch(fetchSuperadminStats());
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

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const res = await dispatch(updateUserRole({ id, role: newRole }));
    if (updateUserRole.fulfilled.match(res)) {
      toast.success(`User updated to ${newRole}`);
      dispatch(fetchSuperadminStats());
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    const res = await dispatch(deleteUser(id));
    if (deleteUser.fulfilled.match(res)) {
      toast.success("User deleted successfully");
      dispatch(fetchSuperadminStats());
    }
  };

  const roleColor = (role) => {
    if (role === "superadmin") return { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" };
    if (role === "admin") return { bg: "rgba(139,92,246,0.15)", text: "#a78bfa" };
    return { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" };
  };

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6" style={{ color: "#f59e0b" }} />
          <div>
            <h1 className="text-2xl font-bold text-white">Overview Dashboard</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Platform-wide metrics at a glance
            </p>
          </div>
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
          <Link
            to="/superadmin/users"
            className="flex items-center gap-1 text-xs font-semibold hover:underline"
            style={{ color: "#f59e0b" }}
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Username", "Email", "Role", "Actions"].map((h) => (
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
                  const isSelf = u.id === currentUser?.id;
                  const isSuper = u.role === "superadmin";

                  return (
                    <tr
                      key={u.id}
                      className="group"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                            style={{
                              background: "linear-gradient(135deg, #302b63, #24243e)",
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
                      <td className="py-4 px-6">
                        {!isSelf && !isSuper ? (
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleToggleRole(u.id, u.role)}
                              title={u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                              className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                            >
                              {u.role === "admin" ? <ShieldEllipsis className="w-4 h-4"/> : <ShieldCheck className="w-4 h-4"/>}
                            </button>
                            <button
                              onClick={() => setResetModal({ open: true, id: u.id, name: u.userName })}
                              title="Reset Password"
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500/50 hover:bg-amber-500/20 hover:text-amber-500 transition-all"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(u.id)}
                              title="Delete User"
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500/50 hover:bg-red-500/20 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] uppercase tracking-tighter opacity-20">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ResetPasswordModal
        open={resetModal.open}
        onClose={() => setResetModal({ open: false, id: null, name: "" })}
        userId={resetModal.id}
        userName={resetModal.name}
      />
    </div>
  );
}

export default SuperAdminDashboard;
