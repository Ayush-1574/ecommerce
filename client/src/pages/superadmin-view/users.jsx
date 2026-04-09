import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
} from "@/store/superadmin-slice";
import { Users, Search, Trash2, RefreshCw, Clock, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const ROLES = ["user", "admin", "superadmin"];

function roleStyles(role) {
  if (role === "superadmin") return { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" };
  if (role === "admin") return { bg: "rgba(139,92,246,0.15)", text: "#a78bfa" };
  return { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" };
}

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
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
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
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              color: "white",
              boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function UsersPage() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.superadmin);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.userName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (id, role) => {
    const result = await dispatch(updateUserRole({ id, role }));
    if (updateUserRole.fulfilled.match(result)) {
      toast.success(`Role updated to "${role}"`);
    } else {
      toast.error(result.payload || "Failed to update role");
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
      toast.success("User deleted");
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
          <Users className="w-6 h-6" style={{ color: "#f59e0b" }} />
          <div>
            <h1 className="text-2xl font-bold text-white">All Users</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {filtered.length} of {users.length} users
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(fetchAllUsers())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap gap-3 p-4 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="flex items-center gap-2 flex-1 min-w-[200px] rounded-xl px-4 py-2.5"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Search className="w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="bg-transparent text-sm text-white outline-none w-full placeholder:text-gray-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="rounded-xl px-4 py-2.5 text-sm font-medium outline-none cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <option value="all" style={{ background: "#1a1730" }}>
            All Roles
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r} style={{ background: "#1a1730" }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {isLoading ? (
          <div className="p-12 text-center">
            <div
              className="w-8 h-8 rounded-full border-2 border-transparent mx-auto animate-spin"
              style={{
                borderTopColor: "#f59e0b",
                borderRightColor: "rgba(245,158,11,0.3)",
              }}
            />
            <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Loading users...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              No users match your filters
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["User", "Email", "Orders", "Role", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-4 px-6 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const rc = roleStyles(u.role);
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr
                      key={u.id}
                      className="group transition-colors"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.025)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #302b63, #24243e)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            {u.userName?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {u.userName}
                              {isSelf && (
                                <span
                                  className="ml-2 text-xs px-1.5 py-0.5 rounded"
                                  style={{
                                    background: "rgba(245,158,11,0.15)",
                                    color: "#f59e0b",
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className="py-4 px-6 text-sm"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {u.email}
                      </td>
                      <td
                        className="py-4 px-6 text-sm font-medium text-white"
                      >
                        {u._count?.orders ?? 0}
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative inline-block">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={isSelf}
                            className="appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold cursor-pointer outline-none capitalize disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                              background: rc.bg,
                              color: rc.text,
                              border: `1px solid ${rc.text}33`,
                            }}
                          >
                            {ROLES.map((r) => (
                              <option
                                key={r}
                                value={r}
                                style={{ background: "#1a1730", color: "white" }}
                              >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                            style={{ color: rc.text }}
                          />
                        </div>
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
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDeleteClick(u.id)}
                          disabled={isSelf}
                          className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ color: "rgba(248,113,113,0.6)" }}
                          onMouseEnter={(e) => {
                            if (!isSelf) {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.12)";
                              e.currentTarget.style.color = "#f87171";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color =
                              "rgba(248,113,113,0.6)";
                          }}
                          title={isSelf ? "Cannot delete yourself" : "Delete user"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message="This action is permanent and cannot be undone. All data associated with this user will be removed."
      />
    </div>
  );
}

export default UsersPage;
