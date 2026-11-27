"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal terdiri dari 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Pendaftaran gagal. Silakan coba kembali.");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-2xl bg-surface ghost-border p-2 shadow-artisan flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <h2 className="font-headline text-2xl font-bold text-primary mt-2">
            {siteConfig.name}
          </h2>
          <p className="font-body text-xs text-secondary font-medium tracking-wide uppercase">
            Pendaftaran Pelanggan Baru
          </p>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-surface py-8 px-6 shadow-artisan rounded-2xl ghost-border sm:px-10">
          <div className="mb-6">
            <h3 className="font-headline text-xl font-bold text-primary">
              Buat Akun Member
            </h3>
            <p className="font-body text-xs text-on-surface-variant mt-1">
              Daftar untuk menikmati kemudahan pemesanan roti segar dan promo eksklusif.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-error-container/60 border border-error/20 flex items-start gap-2.5 text-on-error-container text-xs">
              <span className="material-symbols-outlined text-[18px] text-error mt-0.5 shrink-0">
                error
              </span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface font-body text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface font-body text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface font-body text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                Ulangi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface font-body text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-full bg-primary text-on-primary font-body text-sm font-semibold shadow-artisan hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-on-surface-variant">
            <span>Sudah memiliki akun? </span>
            <Link href="/login" className="font-semibold text-secondary hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Beranda Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
