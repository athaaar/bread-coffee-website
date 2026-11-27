"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    topic: "pemesanan",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-24" id="hubungi-kami">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form & Info */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-secondary font-body text-xs font-semibold tracking-wider uppercase mb-2">
                <span className="material-symbols-outlined text-[16px]">mark_email_read</span>
                <span>Hubungi &amp; Kunjungi Kami</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                Mari Terhubung atau Singgah untuk Secangkir Kopi Hangat
              </h2>
              <p className="font-body text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
                Punya pertanyaan mengenai pesanan shokupan harian, katering event, pemesanan hampers, atau sekadar ingin menyapa? Kami dengan senang hati menyambut Anda.
              </p>
            </div>

            {/* Quick Contacts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-container-low ghost-border flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5 shrink-0">
                  location_on
                </span>
                <div>
                  <h3 className="font-body text-xs sm:text-sm text-primary font-bold">
                    Alamat Bakery &amp; Cafe
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {siteConfig.contact.address}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low ghost-border flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5 shrink-0">
                  call
                </span>
                <div>
                  <h3 className="font-body text-xs sm:text-sm text-primary font-bold">
                    Telepon &amp; WhatsApp
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                    <a
                      href={siteConfig.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline font-medium"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low ghost-border flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5 shrink-0">
                  mail
                </span>
                <div>
                  <h3 className="font-body text-xs sm:text-sm text-primary font-bold">
                    Email Resmi
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                    <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
                      {siteConfig.contact.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low ghost-border flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5 shrink-0">
                  schedule
                </span>
                <div>
                  <h3 className="font-body text-xs sm:text-sm text-primary font-bold">
                    Jam Operasional
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                    {siteConfig.contact.operationalHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="p-6 md:p-8 rounded-2xl bg-surface-container-low ghost-border">
              {submitted ? (
                <div className="p-6 rounded-xl bg-surface text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">check_circle</span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-primary">
                    Pesan Berhasil Terkirim!
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-md">
                    Terima kasih, <strong>{formData.name}</strong>. Tim {siteConfig.name} telah menerima pesan Anda dan akan segera menghubungi nomor WhatsApp Anda.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", phone: "", email: "", topic: "pemesanan", message: "" });
                    }}
                    className="mt-2 text-xs font-semibold text-secondary hover:underline"
                  >
                    Kirim pesan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-primary">
                    Kirimkan Pesan Anda
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                        Nama Lengkap <span className="text-error">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-4 py-2.5 rounded-lg bg-surface ghost-border text-on-surface font-body text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                        Nomor WhatsApp <span className="text-error">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Contoh: 08123456789"
                        className="w-full px-4 py-2.5 rounded-lg bg-surface ghost-border text-on-surface font-body text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                        Alamat Email <span className="text-error">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-surface ghost-border text-on-surface font-body text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="topic" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                        Topik Pesan
                      </label>
                      <select
                        id="topic"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-surface ghost-border text-on-surface font-body text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                      >
                        <option value="pemesanan">Pemesanan Roti &amp; Kopi</option>
                        <option value="catering">Katering &amp; Event Pop-up</option>
                        <option value="masterclass">Pendaftaran Masterclass</option>
                        <option value="hampers">Pemesanan Hampers / Gift</option>
                        <option value="umum">Pertanyaan Umum</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-body text-xs font-semibold text-on-surface-variant mb-1.5">
                      Pesan Anda <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tuliskan detail pesanan, jumlah loaf, tanggal acara, atau pertanyaan Anda di sini..."
                      className="w-full px-4 py-2.5 rounded-lg bg-surface ghost-border text-on-surface font-body text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full sm:w-auto self-start px-8 py-3.5 rounded-full bg-primary text-on-primary font-body text-sm font-semibold shadow-artisan hover:bg-primary-container transition-all scale-100 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Kirim Pesan Sekarang</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Embed & Location Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden ghost-border shadow-artisan bg-surface-container relative">
              <div className="h-[360px] sm:h-[400px] w-full relative">
                <iframe
                  title="Peta Lokasi The Daily Knead Bakery & Cafe"
                  src={siteConfig.contact.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Bottom Info Bar below Map */}
              <div className="p-4 bg-surface/95 backdrop-blur-sm border-t ghost-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-body text-xs font-bold text-primary">{siteConfig.name}</h4>
                    <p className="font-body text-[11px] text-on-surface-variant">Buka di Google Maps</p>
                  </div>
                </div>
                <a
                  href={siteConfig.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-body text-xs font-semibold hover:bg-primary-container transition-colors shadow-sm"
                >
                  <span>Buka Peta</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </a>
              </div>
            </div>

            {/* Direct WhatsApp Callout Card */}
            <div className="p-6 rounded-2xl bg-surface-container-low ghost-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[26px]">chat</span>
                </div>
                <div>
                  <h4 className="font-body text-sm font-bold text-primary">Ingin Konsultasi Cepat?</h4>
                  <p className="font-body text-xs text-on-surface-variant">
                    Hubungi kami langsung via WhatsApp untuk respon instan.
                  </p>
                </div>
              </div>
              <a
                href={siteConfig.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-body text-xs font-semibold hover:bg-secondary-container hover:text-on-secondary-container transition-all shadow-sm"
              >
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
