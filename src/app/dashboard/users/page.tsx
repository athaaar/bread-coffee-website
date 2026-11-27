"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive";
  created_at: string;
}

interface Role {
  id: string;
  name: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [uRes, rRes] = await Promise.all([
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/roles").then((r) => r.json()),
      ]);
      setUsers(uRes.data || []);
      setRoles(rRes.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Gagal memuat data pengguna.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusToggle = async (user: User) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    setActionLoading(user.id);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengubah status pengguna.");
      }
      setMessage({ text: `Status ${user.name} berhasil diubah menjadi ${nextStatus}.`, type: "success" });
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setActionLoading(userId);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role_id: newRoleId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengubah role pengguna.");
      }
      setMessage({ text: "Role pengguna berhasil diperbarui.", type: "success" });
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${user.name}" (${user.email})?`)) {
      return;
    }

    setActionLoading(user.id);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus pengguna.");
      }
      setMessage({ text: `Pengguna ${user.name} berhasil dihapus.`, type: "success" });
      await loadData();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary">Manajemen Pengguna</h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Daftar seluruh akun yang tersimpan di Google Spreadsheet.
          </p>
        </div>
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface ghost-border text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
          />
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-2.5">
            search
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            message.type === "success"
              ? "bg-tertiary-fixed text-on-tertiary-fixed"
              : "bg-error-container text-on-error-container"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* Users Table Card */}
      <div className="bg-surface rounded-2xl ghost-border shadow-artisan overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b ghost-border bg-surface-container text-on-surface-variant font-body text-xs uppercase tracking-wider">
                <th className="py-3.5 px-5">Pengguna</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Terdaftar</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y ghost-border font-body text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    <span className="inline-block w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin mr-2"></span>
                    Memuat data pengguna dari database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                    Tidak ada pengguna yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isBusy = actionLoading === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                            {user.name?.[0] || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-primary">{user.name}</p>
                            <p className="text-on-surface-variant text-[11px]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <select
                          value={user.role_id}
                          disabled={isBusy}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-surface-container-low border ghost-border rounded-lg px-2.5 py-1 text-xs text-primary font-medium focus:ring-1 focus:ring-secondary disabled:opacity-50"
                        >
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            user.status === "active"
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : "bg-error-container text-on-error-container"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{user.status === "active" ? "Aktif" : "Nonaktif"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-on-surface-variant">
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleStatusToggle(user)}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold transition-colors disabled:opacity-50"
                            title={user.status === "active" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          >
                            {user.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(user)}
                            className="p-1 rounded-lg text-error hover:bg-error-container/40 transition-colors disabled:opacity-50"
                            title="Hapus Pengguna"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
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
