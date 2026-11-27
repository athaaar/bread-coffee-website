"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Failed to fetch user session", err));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { label: "Ringkasan", href: "/dashboard", icon: "dashboard" },
    { label: "Manajemen Pengguna", href: "/dashboard/users", icon: "group" },
    { label: "Manajemen Role", href: "/dashboard/roles", icon: "badge" },
    { label: "Kelola Berita & Artikel", href: "/dashboard/news", icon: "article" },
    { label: "Profil & Keamanan", href: "/dashboard/profile", icon: "manage_accounts" },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-surface flex-col justify-between border-r ghost-border shrink-0 min-h-screen sticky top-0 p-5">
        <div className="flex flex-col gap-6">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/90 p-1 ghost-border flex items-center justify-center">
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="font-headline text-base font-bold text-primary leading-tight">
                {siteConfig.name}
              </h2>
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" aria-label="Navigasi Dashboard">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-body text-xs font-semibold transition-all ${
                    active
                      ? "bg-primary text-on-primary shadow-artisan"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t ghost-border flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
              {user?.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="font-body text-xs font-bold text-primary truncate">
                {user?.name || "Admin"}
              </p>
              <p className="font-body text-[11px] text-on-surface-variant truncate">
                {user?.email || "admin@gmail.com"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 py-2 px-2.5 rounded-lg bg-surface-container text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors text-center inline-flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              <span>Web</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex-1 py-2 px-2.5 rounded-lg bg-error-container/50 text-xs font-semibold text-on-error-container hover:bg-error-container transition-colors text-center inline-flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">logout</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top App Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b ghost-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/90 p-0.5 ghost-border flex items-center justify-center">
            <Image src={siteConfig.logo} alt={siteConfig.name} width={28} height={28} />
          </div>
          <span className="font-headline text-sm font-bold text-primary">Dashboard Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-primary hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileSidebarOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-surface border-b ghost-border p-4 flex flex-col gap-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-body text-xs font-semibold ${
                pathname === item.href
                  ? "bg-primary text-on-primary"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-2 border-t ghost-border flex gap-2">
            <Link
              href="/"
              className="flex-1 py-2 text-center text-xs font-semibold bg-surface-container rounded-lg"
            >
              Lihat Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 text-center text-xs font-semibold bg-error-container text-on-error-container rounded-lg"
            >
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
