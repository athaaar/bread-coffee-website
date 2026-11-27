import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function AboutSection() {
  const { about } = siteConfig;

  return (
    <section className="py-16 md:py-24 bg-surface-container-low" id="tentang-kami">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image with Master Baker */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-artisan ghost-border bg-surface">
              <Image
                src={siteConfig.aboutImage}
                alt="Head baker The Daily Knead sedang menguleni adonan roti dengan cermat"
                width={700}
                height={800}
                className="w-full h-[440px] sm:h-[500px] object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
            {/* Floating Badge Overlay */}
            <div className="absolute -bottom-5 -right-2 sm:right-4 bg-surface p-4 rounded-xl shadow-artisan ghost-border max-w-xs flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-[32px] shrink-0">
                workspace_premium
              </span>
              <div>
                <p className="font-body text-xs sm:text-sm font-bold text-primary">
                  {about.experienceYears}
                </p>
                <p className="font-body text-xs text-on-surface-variant">
                  {about.experienceDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-secondary font-body text-xs font-semibold tracking-wider uppercase mb-2">
                <span className="material-symbols-outlined text-[16px]">history_edu</span>
                <span>{about.badge}</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-tight">
                {about.headline}
              </h2>
            </div>

            <div className="space-y-4 text-on-surface-variant font-body text-sm sm:text-base leading-relaxed">
              {about.storyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* 3 Key Strengths Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {about.strengths.map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl bg-surface ghost-border flex flex-col gap-2 hover:bg-surface-bright transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <h3 className="font-body text-xs sm:text-sm font-bold text-primary">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
