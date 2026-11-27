"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category?: string;
  date?: string;
  image?: string;
  thumbnail_path?: string;
  readTime?: string;
  created_at?: string;
}

export default function NewsSection() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setArticles(json.data);
        } else {
          // Fallback ke data default di siteConfig jika belum ada artikel terbit
          setArticles(siteConfig.articles);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat berita aktual:", err);
        setArticles(siteConfig.articles);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-surface-container-low" id="warta-artikel">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-secondary font-body text-xs font-semibold tracking-wider uppercase mb-2">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>Warta, Tips &amp; Edukasi</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              Warta, Tips &amp; Cerita Rasa
            </h2>
          </div>
          <Link
            href="#warta-artikel"
            className="inline-flex items-center gap-2 text-primary font-body text-sm font-semibold hover:text-secondary transition-colors group"
          >
            <span>Lihat Semua Artikel</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 py-16 text-center text-on-surface-variant font-body text-sm">
              <span className="inline-block w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin mr-2"></span>
              Menghubungkan ke database berita The Daily Knead...
            </div>
          ) : (
            articles.map((article) => {
              const imageSrc =
                article.thumbnail_path || article.image || "/images/article-1.png";
              const dateText = article.created_at
                ? new Date(article.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : article.date || "Terbaru";

              return (
                <article
                  key={article.id}
                  className="bg-surface rounded-2xl overflow-hidden shadow-artisan ghost-border flex flex-col group hover:shadow-md transition-shadow duration-300"
                >
                  <div className="overflow-hidden h-48 bg-surface-container relative">
                    <Image
                      src={imageSrc}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-fixed/50 text-secondary">
                          {article.category || "Artisan Bakery"}
                        </span>
                        <span className="font-body text-xs text-on-surface-variant">
                          {dateText}
                        </span>
                      </div>
                      <h3 className="font-headline text-base sm:text-lg font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="font-body text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t ghost-border flex items-center justify-between text-xs text-secondary">
                      <span className="font-medium">{article.readTime || "3 menit baca"}</span>
                      <Link
                        href={`#warta-${article.id}`}
                        className="inline-flex items-center gap-1 font-body font-semibold text-secondary hover:text-primary transition-colors"
                      >
                        <span>Baca Selengkapnya</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
