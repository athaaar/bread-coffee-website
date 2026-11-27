import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-high border-t ghost-border text-on-surface-variant pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b ghost-border">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link href="#beranda" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/80 p-1 ghost-border flex items-center justify-center">
                <Image
                  src={siteConfig.logo}
                  alt={`${siteConfig.name} Logo`}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-headline text-lg font-bold text-primary block leading-tight">
                  {siteConfig.name}
                </span>
                <span className="text-[11px] font-medium tracking-wide text-secondary uppercase">
                  Artisan Bakery &amp; Coffee
                </span>
              </div>
            </Link>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <p className="font-body text-xs text-secondary font-medium">
              Dirintis dengan dedikasi oleh {siteConfig.founder}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-primary uppercase tracking-wider">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px] text-secondary">
                      chevron_right
                    </span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Operational & Contacts */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-primary uppercase tracking-wider">
              Kunjungi Kami
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="leading-relaxed">
                <strong>Alamat:</strong> {siteConfig.contact.address}
              </p>
              <p>
                <strong>Jam Buka:</strong> {siteConfig.contact.operationalHours}
              </p>
              <p>
                <strong>WhatsApp:</strong>{" "}
                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline font-medium"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
                  {siteConfig.contact.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <p>
            &copy; {currentYear} {siteConfig.name}. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan rasa cinta &amp; ketulusan oleh</span>
            <span className="font-semibold text-primary">{siteConfig.founder}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
