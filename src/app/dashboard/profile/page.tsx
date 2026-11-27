"use client";

import { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Konfirmasi password baru tidak cocok.", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "Password baru minimal terdiri dari 6 karakter.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengubah password.");
      }

      setMessage({ text: data.message || "Password berhasil diubah!", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-bold text-primary">Profil &amp; Keamanan Akun</h1>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
          Informasi akun administrator dan perubahan kata sandi.
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

      {/* Account Info Card */}
      <div className="bg-surface p-6 rounded-2xl ghost-border shadow-artisan space-y-4 font-body text-xs">
        <h2 className="font-headline text-base font-bold text-primary">Informasi Akun</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-on-surface-variant font-medium">Nama Administrator</p>
            <p className="font-bold text-primary text-sm mt-0.5">{user?.name || "Memuat..."}</p>
          </div>
          <div>
            <p className="text-on-surface-variant font-medium">Alamat Email</p>
            <p className="font-bold text-primary text-sm mt-0.5">{user?.email || "Memuat..."}</p>
          </div>
          <div>
            <p className="text-on-surface-variant font-medium">Peran Sistem</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary-fixed/50 text-secondary uppercase">
              {user?.role || "admin"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-surface p-6 rounded-2xl ghost-border shadow-artisan space-y-4 font-body text-xs">
        <div>
          <h2 className="font-headline text-base font-bold text-primary">Ubah Password</h2>
          <p className="text-on-surface-variant mt-1">
            Ganti password bawaan <code className="font-mono text-primary font-bold">123456</code> dengan password baru yang kuat.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">Password Lama</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan password saat ini (cth: 123456)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">Password Baru</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block font-semibold text-on-surface-variant mb-1">
              Ulangi Password Baru
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang password baru"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            )}
            <span>Simpan Password Baru</span>
          </button>
        </form>
      </div>
    </div>
  );
}
