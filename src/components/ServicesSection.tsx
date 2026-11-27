import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function ServicesSection() {
  return (
    <section className="py-16 md:py-24" id="layanan-menu">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-secondary font-body text-xs font-semibold tracking-wider uppercase mb-2">
            <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
            <span>Menu &amp; Pilihan Layanan</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
            Layanan &amp; Keahlian Kami
          </h2>
          <p className="font-body text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Solusi sajian roti Jepang artisan dan kopi specialty untuk santap harian, kantor, acara gathering, hingga bingkisan istimewa.
          </p>
        </div>

        {/* 6 Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.services.map((service) => (
            <div
              key={service.id}
              className="group p-6 rounded-2xl bg-surface-container-low ghost-border hover:bg-surface-container transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">
                      {service.icon}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${service.badgeColor}`}
                  >
                    {service.badge}
                  </span>
                </div>
                <h3 className="font-headline text-lg sm:text-xl font-bold text-primary mb-2">
                  {service.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-on-surface-variant mb-4 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t ghost-border flex items-center justify-between text-xs sm:text-sm font-semibold text-secondary">
                <span>{service.priceHint}</span>
                <Link
                  href="#hubungi-kami"
                  aria-label={`Pesan ${service.title}`}
                  className="inline-flex items-center gap-1 group-hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
