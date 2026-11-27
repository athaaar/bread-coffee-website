"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalRoles: number;
}

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    totalRoles: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersRes, rolesRes, newsRes] = await Promise.all([
          fetch("/api/admin/users").then((r) => r.json()),
          fetch("/api/admin/roles").then((r) => r.json()),
          fetch("/api/admin/news").then((r) => r.json()),
        ]);

        const newsList = newsRes.data || [];
        const publishedCount = newsList.filter((n: any) => n.status === "published").length;

        setStats({
          totalUsers: (usersRes.data || []).length,
          totalRoles: (rolesRes.data || []).length,
          totalNews: newsList.length,
          publishedNews: publishedCount,
          draftNews: newsList.length - publishedCount,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-primary">
            Ringkasan Dashboard
          </h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Selamat datang di panel kendali The Daily Knead. Kelola artikel, pengguna, dan peran sistem di sini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/news"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-on-primary font-body text-xs font-semibold shadow-artisan hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Tulis Berita Baru</span>
          </Link>
        </div>
      </div>

      {/* Security Notice: Default Admin Password Alert */}
      <div className="p-4 sm:p-5 rounded-2xl bg-secondary-fixed/40 border border-secondary/30 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[22px]">shield</span>
        </div>
        <div className="flex-1">
          <h3 className="font-body text-sm font-bold text-primary">
            Pemberitahuan Keamanan: Ganti Password Admin Bawaan
          </h3>
          <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
            Akun admin saat ini menggunakan password bawaan publik (<code className="bg-surface px-1.5 py-0.5 rounded font-mono text-primary font-bold">123456</code>). Sangat disarankan untuk segera mengganti password di halaman profil sebelum website dipublikasikan ke internet.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline mt-2"
          >
            <span>Ubah Password Admin Sekarang</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-surface ghost-border shadow-artisan flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[26px]">group</span>
          </div>
          <div>
            <p className="font-body text-xs text-on-surface-variant">Total Pengguna</p>
            <p className="font-headline text-2xl font-bold text-primary">
              {loading ? "..." : stats.totalUsers}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface ghost-border shadow-artisan flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">article</span>
          </div>
          <div>
            <p className="font-body text-xs text-on-surface-variant">Berita Terbit</p>
            <p className="font-headline text-2xl font-bold text-primary">
              {loading ? "..." : stats.publishedNews}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface ghost-border shadow-artisan flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">edit_note</span>
          </div>
          <div>
            <p className="font-body text-xs text-on-surface-variant">Draft Berita</p>
            <p className="font-headline text-2xl font-bold text-primary">
              {loading ? "..." : stats.draftNews}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface ghost-border shadow-artisan flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[26px]">badge</span>
          </div>
          <div>
            <p className="font-body text-xs text-on-surface-variant">Role Pengguna</p>
            <p className="font-headline text-2xl font-bold text-primary">
              {loading ? "..." : stats.totalRoles}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/news"
          className="p-6 rounded-2xl bg-surface ghost-border hover:bg-surface-container transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">feed</span>
            </div>
            <h3 className="font-headline text-base font-bold text-primary">Kelola Berita &amp; Artikel</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Tambah, edit, hapus artikel, serta unggah gambar thumbnail baru ke folder lokal.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary mt-4 group-hover:translate-x-1 transition-transform">
            <span>Buka Manajemen Berita</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </span>
        </Link>

        <Link
          href="/dashboard/users"
          className="p-6 rounded-2xl bg-surface ghost-border hover:bg-surface-container transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">manage_accounts</span>
            </div>
            <h3 className="font-headline text-base font-bold text-primary">Manajemen Pengguna</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Cari pengguna terdaftar, aktifkan/nonaktifkan akun, atau ubah role pengguna.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary mt-4 group-hover:translate-x-1 transition-transform">
            <span>Buka Manajemen User</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </span>
        </Link>

        <Link
          href="/dashboard/roles"
          className="p-6 rounded-2xl bg-surface ghost-border hover:bg-surface-container transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">security</span>
            </div>
            <h3 className="font-headline text-base font-bold text-primary">Manajemen Role</h3>
            <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
              Atur hak akses pengguna dan tambahkan peran kustom untuk staf toko atau editor konten.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary mt-4 group-hover:translate-x-1 transition-transform">
            <span>Buka Manajemen Role</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
