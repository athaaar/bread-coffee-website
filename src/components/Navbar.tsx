"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md shadow-sm transition-all duration-300 border-b ghost-border">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center w-full">
        {/* Brand Logo & Name */}
        <Link
          href="#beranda"
          className="flex items-center gap-3 scale-100 hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200"
        >
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white/70 p-1 ghost-border flex items-center justify-center">
            <Image
              src={siteConfig.logo}
              alt={`${siteConfig.name} Logo`}
              width={44}
              height={44}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg sm:text-xl font-bold tracking-tight text-primary leading-tight">
              {siteConfig.name}
            </span>
            <span className="text-[11px] font-medium tracking-wide text-secondary uppercase">
              Artisan Bakery &amp; Coffee
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigasi Utama">
          {siteConfig.navLinks.map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-sm font-medium transition-colors duration-200 ${
                idx === 0
                  ? "text-primary border-b-2 border-secondary pb-0.5"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Trailing Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {user.role === "admin" ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-body text-xs font-semibold hover:bg-primary-container shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">dashboard</span>
                  <span>Dashboard Admin</span>
                </Link>
              ) : (
                <span className="text-xs font-semibold text-primary px-3 py-1.5 rounded-full bg-surface-container">
                  Halo, {user.name}
                </span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
                title="Keluar"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary text-on-primary font-body text-xs font-semibold hover:bg-primary-container hover:text-on-primary-container border border-primary transition-all duration-200 shadow-sm"
            >
              Masuk / Area Member
            </Link>
          )}

          {/* Mobile Menu Trigger Button */}
          <button
            type="button"
            aria-label="Buka navigasi menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-6 pt-3 pb-6 bg-surface-container-low border-b ghost-border shadow-md animate-fadeIn"
          id="mobile-navigation"
        >
          <div className="flex flex-col gap-3">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-on-surface font-body text-sm font-medium py-2 border-b ghost-border hover:text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="pt-2 flex flex-col gap-2">
                {user.role === "admin" && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-full bg-primary text-on-primary font-body text-xs font-semibold"
                  >
                    Buka Dashboard Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-center py-2 rounded-full bg-error-container text-on-error-container font-body text-xs font-semibold"
                >
                  Keluar ({user.name})
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 text-center py-2.5 rounded-full bg-primary text-on-primary font-body text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm"
              >
                Masuk / Area Member
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
