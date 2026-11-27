"use client";

import { useState, useEffect } from "react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean;
  created_at: string;
}

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // New Role Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState("read");

  const loadRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      setRoles(data.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Gagal memuat daftar role.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, permissions }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menambahkan role.");
      }

      setMessage({ text: data.message || "Role berhasil ditambahkan.", type: "success" });
      setName("");
      setDescription("");
      setPermissions("read");
      await loadRoles();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.is_system) {
      alert("Role bawaan sistem tidak boleh dihapus.");
      return;
    }

    if (!confirm(`Hapus role "${role.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/roles?id=${role.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus role.");
      }
      setMessage({ text: "Role berhasil dihapus.", type: "success" });
      await loadRoles();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary">Manajemen Role</h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
          Konfigurasi peran dan hak akses pengguna di dalam sistem The Daily Knead.
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Roles List Table */}
        <div className="lg:col-span-8 bg-surface rounded-2xl ghost-border shadow-artisan overflow-hidden">
          <div className="p-5 border-b ghost-border">
            <h2 className="font-headline text-base font-bold text-primary">Daftar Role Terdaftar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b ghost-border bg-surface-container text-on-surface-variant font-body text-xs uppercase tracking-wider">
                  <th className="py-3 px-5">Nama Role</th>
                  <th className="py-3 px-5">Deskripsi</th>
                  <th className="py-3 px-5">Hak Akses</th>
                  <th className="py-3 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y ghost-border font-body text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-on-surface-variant">
                      Memuat data role...
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-on-surface-variant">
                      Belum ada role terdaftar.
                    </td>
                  </tr>
                ) : (
                  roles.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary capitalize">{r.name}</span>
                          {r.is_system && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary-fixed/50 text-secondary">
                              Sistem
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-on-surface-variant">{r.description || "-"}</td>
                      <td className="py-4 px-5">
                        <span className="font-mono text-[11px] bg-surface-container px-2 py-1 rounded">
                          {r.permissions}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {r.is_system ? (
                          <span className="text-on-surface-variant text-[11px] italic">Terkunci</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteRole(r)}
                            className="p-1 rounded-lg text-error hover:bg-error-container/40 transition-colors"
                            title="Hapus Role"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Role Form Card */}
        <div className="lg:col-span-4 bg-surface p-6 rounded-2xl ghost-border shadow-artisan">
          <h2 className="font-headline text-base font-bold text-primary mb-4">Tambah Role Baru</h2>
          <form onSubmit={handleAddRole} className="space-y-4 font-body text-xs">
            <div>
              <label htmlFor="role-name" className="block font-semibold text-on-surface-variant mb-1">
                Nama Role
              </label>
              <input
                id="role-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: editor, kasir, barista"
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div>
              <label htmlFor="role-desc" className="block font-semibold text-on-surface-variant mb-1">
                Deskripsi
              </label>
              <textarea
                id="role-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tanggung jawab dan cakupan peran ini..."
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
              ></textarea>
            </div>

            <div>
              <label htmlFor="role-perm" className="block font-semibold text-on-surface-variant mb-1">
                Hak Akses (Permissions)
              </label>
              <select
                id="role-perm"
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
              >
                <option value="read">Hanya Baca (Read Only)</option>
                <option value="news_writer">Penulis Artikel (News CRUD)</option>
                <option value="orders_manager">Manajemen Pesanan (Orders)</option>
                <option value="all">Akses Penuh (Administrator)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-2.5 px-4 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>{actionLoading ? "Menyimpan..." : "Tambah Role"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
