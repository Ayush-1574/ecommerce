import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  createAdminUser,
  updateUserRole,
  deleteUser,
} from "@/store/superadmin-slice";
import {
  UserCog,
  Plus,
  X,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-md"
        style={{
          background: "#1a1730",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              color: "white",
              boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
            }}
          >
            Delete Admin
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateAdminModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userName || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    const result = await dispatch(createAdminUser(form));
    setLoading(false);
    if (createAdminUser.fulfilled.match(result)) {
      toast.success("Admin created successfully!");
      setForm({ userName: "", email: "", password: "" });
      onClose();
    } else {
      toast.error(result.payload || "Failed to create admin");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-md"
        style={{
          background: "#1a1730",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
              }}
            >
              <UserCog className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Create Admin Account</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { key: "userName", label: "Username", type: "text", placeholder: "e.g. admin_john" },
            { key: "email", label: "Email Address", type: "email", placeholder: "admin@example.com" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(245,158,11,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>
          ))}

          {/* Password field */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Min. 8 characters"
                className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(245,158,11,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
              <button
                type="button"
                onClick={() => setShowPwd((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {showPwd ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: loading
                  ? "rgba(245,158,11,0.4)"
                  : "linear-gradient(135deg, #f59e0b, #d97706)",
                boxShadow: loading ? "none" : "0 4px 14px rgba(245,158,11,0.35)",
              }}
            >
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminsPage() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.superadmin);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const admins = users.filter((u) => u.role === "admin" || u.role === "superadmin");

  const handleDemote = async (id) => {
    const result = await dispatch(updateUserRole({ id, role: "user" }));
    if (updateUserRole.fulfilled.match(result)) {
      toast.success("Admin demoted to user");
    } else {
      toast.error(result.payload || "Failed");
    }
  };

  const handleDeleteClick = (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setConfirmOpen(false);
    if (!pendingDeleteId) return;
    const result = await dispatch(deleteUser(pendingDeleteId));
    if (deleteUser.fulfilled.match(result)) {
      toast.success("Admin deleted");
    } else {
      toast.error(result.payload || "Failed to delete");
    }
    setPendingDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <UserCog className="w-6 h-6" style={{ color: "#f59e0b" }} />
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Admins</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {admins.length} admin account{admins.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => dispatch(fetchAllUsers())}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
            }}
          >
            <Plus className="w-4 h-4" />
            New Admin
          </button>
        </div>
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl h-48 animate-pulse"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <ShieldCheck
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "rgba(255,255,255,0.1)" }}
          />
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            No admins found. Create one using the button above.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {admins.map((admin) => {
            const isSelf = admin.id === currentUser?.id;
            const isSuperAdmin = admin.role === "superadmin";
            return (
              <div
                key={admin.id}
                className="rounded-2xl p-6 flex flex-col gap-5 transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: isSuperAdmin
                    ? "1px solid rgba(245,158,11,0.2)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isSuperAdmin
                    ? "0 8px 32px rgba(245,158,11,0.08)"
                    : "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
                      style={{
                        background: isSuperAdmin
                          ? "linear-gradient(135deg, #f59e0b, #d97706)"
                          : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                        boxShadow: isSuperAdmin
                          ? "0 4px 14px rgba(245,158,11,0.35)"
                          : "0 4px 14px rgba(139,92,246,0.3)",
                      }}
                    >
                      {admin.userName?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white flex items-center gap-1">
                        {admin.userName}
                        {isSelf && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              background: "rgba(245,158,11,0.15)",
                              color: "#f59e0b",
                            }}
                          >
                            You
                          </span>
                        )}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {admin.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                    style={{
                      background: isSuperAdmin
                        ? "rgba(245,158,11,0.15)"
                        : "rgba(139,92,246,0.15)",
                      color: isSuperAdmin ? "#f59e0b" : "#a78bfa",
                    }}
                  >
                    {admin.role}
                  </span>
                </div>

                {/* Meta */}
                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  <Clock className="w-3 h-3" />
                  Joined{" "}
                  {new Date(admin.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                {/* Actions */}
                {!isSelf && !isSuperAdmin && (
                  <div className="flex gap-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={() => handleDemote(admin.id)}
                      className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      Demote to User
                    </button>
                    <button
                      onClick={() => handleDeleteClick(admin.id)}
                      className="p-2 rounded-xl transition-all"
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        color: "#f87171",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {(isSelf || isSuperAdmin) && (
                  <p
                    className="text-xs text-center pt-2 italic"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    {isSelf ? "This is your account" : "Super admin — protected"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <CreateAdminModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Admin"
        message="This will permanently delete the admin account. This action cannot be undone."
      />
    </div>
  );
}

export default AdminsPage;
