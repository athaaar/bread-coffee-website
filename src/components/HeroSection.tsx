import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20" id="beranda">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-6 flex flex-col items-start gap-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-fixed/50 border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-[16px]">bakery_dining</span>
              <span className="font-body text-xs font-semibold text-secondary tracking-wide">
                Japanese Artisan Bakery &amp; Specialty Roastery
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
              Kehangatan Roti Jepang Segar &amp; Aroma Kopi Pilihan Setiap Pagi
            </h1>

            {/* Subheading */}
            <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Dilahirkan dari tekad dan kerja keras anak muda, kami memadukan kelembutan roti Jepang otentik dengan fermentasi ragi alami 24 jam serta biji kopi specialty Nusantara untuk menghadirkan rasa terbaik.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link
                href="#layanan-menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-on-primary font-body text-sm font-semibold shadow-artisan hover:bg-primary-container transition-all duration-200 scale-100 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Jelajahi Menu &amp; Layanan</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                href="#hubungi-kami"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-transparent border-2 border-primary/20 text-primary font-body text-sm font-semibold hover:bg-surface-container transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                <span>Kunjungi Bakery &amp; Cafe</span>
              </Link>
            </div>

            {/* Mini Trust Anchor */}
            <div className="flex items-center gap-3 pt-3">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full bg-primary-container text-inverse-primary flex items-center justify-center text-xs font-bold ring-2 ring-background">
                  DK
                </span>
                <span className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold ring-2 ring-background">
                  24h
                </span>
                <span className="w-8 h-8 rounded-full bg-tertiary-container text-tertiary-fixed flex items-center justify-center text-xs font-bold ring-2 ring-background">
                  ☕
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-on-surface-variant">
                Dirintis oleh <span className="font-semibold text-primary">{siteConfig.founder}</span> untuk pecinta roti sejati.
              </p>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-artisan ghost-border bg-surface-container">
              <Image
                src={siteConfig.heroImage}
                alt="Meja kayu toko roti artisan The Daily Knead dengan roti gandum segar dan secangkir kopi"
                width={800}
                height={600}
                className="w-full h-[360px] sm:h-[460px] object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                priority
              />
              {/* Floating Glassmorphic Status Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 rounded-xl bg-surface/90 backdrop-blur-md ghost-border flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">local_cafe</span>
                  </div>
                  <div>
                    <h4 className="font-body text-xs font-bold text-primary">Batch Subuh Telah Matang</h4>
                    <p className="font-body text-xs text-on-surface-variant">Shokupan Lembut &amp; Kopi Aceh Gayo</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                  Segar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Proof Points Strip */}
        <div className="mt-12 pt-8 border-t ghost-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
            {siteConfig.proofPoints.map((item) => (
              <div key={item.title} className="flex items-center gap-3.5 justify-center md:justify-start">
                <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </div>
                <div>
                  <p className="font-headline text-base sm:text-lg font-bold text-primary">{item.title}</p>
                  <p className="font-body text-xs sm:text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
