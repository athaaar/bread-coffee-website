"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft";
  author_id: string;
  created_at: string;
  updated_at: string;
}

export default function NewsManagementPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Gagal memuat daftar berita.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setStatus("published");
    setThumbnailFile(null);
    setThumbnailPreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingArticle(article);
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setContent(article.content);
    setStatus(article.status);
    setThumbnailFile(null);
    setThumbnailPreview(article.thumbnail_path);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("status", status);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else if (editingArticle?.thumbnail_path) {
        formData.append("thumbnail_path", editingArticle.thumbnail_path);
      }

      const url = editingArticle ? `/api/admin/news/${editingArticle.id}` : "/api/admin/news";
      const method = editingArticle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan artikel.");
      }

      setMessage({
        text: editingArticle ? "Artikel berhasil diperbarui." : "Artikel baru berhasil ditambahkan.",
        type: "success",
      });
      setIsModalOpen(false);
      await loadArticles();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (article: NewsArticle) => {
    if (!confirm(`Hapus artikel "${article.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/news/${article.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus artikel.");
      }
      setMessage({ text: "Artikel berhasil dihapus.", type: "success" });
      await loadArticles();
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  const filteredArticles = articles.filter((a) => {
    if (filter === "published") return a.status === "published";
    if (filter === "draft") return a.status === "draft";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary">Manajemen Berita &amp; Artikel</h1>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Tulis tips, edukasi roti &amp; kopi, atau warta promosi yang tampil di landing page.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-body text-xs font-semibold shadow-artisan hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            message.type === "success"
              ? "bg-tertiary-fixed text-on-tertiary-fixed"
              : "bg-error-container text-on-error-container"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b ghost-border pb-3">
        {(["all", "published", "draft"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? "bg-primary text-on-primary"
                : "bg-surface text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {tab === "all" ? "Semua Artikel" : tab === "published" ? "Terbit (Published)" : "Draft"}
          </button>
        ))}
      </div>

      {/* News Table */}
      <div className="bg-surface rounded-2xl ghost-border shadow-artisan overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b ghost-border bg-surface-container text-on-surface-variant font-body text-xs uppercase tracking-wider">
                <th className="py-3 px-5">Artikel</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Tanggal</th>
                <th className="py-3 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y ghost-border font-body text-xs">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-on-surface-variant">
                    Memuat artikel...
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-on-surface-variant">
                    Belum ada artikel pada kategori ini.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-12 rounded-lg overflow-hidden bg-surface-container shrink-0 ghost-border">
                          {article.thumbnail_path ? (
                            <Image
                              src={article.thumbnail_path}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                              <span className="material-symbols-outlined text-[18px]">image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary line-clamp-1">{article.title}</h4>
                          <p className="text-on-surface-variant text-[11px] line-clamp-1">{article.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          article.status === "published"
                            ? "bg-tertiary-fixed text-on-tertiary-fixed"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {article.status === "published" ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-on-surface-variant">
                      {new Date(article.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewArticle(article)}
                          className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                          title="Pratinjau Artikel"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(article)}
                          className="p-1 rounded-lg hover:bg-surface-container text-secondary transition-colors"
                          title="Edit Artikel"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(article)}
                          className="p-1 rounded-lg hover:bg-error-container/40 text-error transition-colors"
                          title="Hapus Artikel"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 ghost-border shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b ghost-border">
              <h2 className="font-headline text-lg font-bold text-primary">
                {editingArticle ? "Ubah Artikel" : "Tulis Artikel Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Rahasia Kerak Sourdough..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">
                  Kutipan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1">Isi Artikel Lengkap</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi artikel dan pembahasan edukatif di sini..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">Status Publikasi</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low ghost-border text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-secondary"
                  >
                    <option value="published">Terbitkan Langsung (Published)</option>
                    <option value="draft">Simpan sebagai Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1">
                    Upload Thumbnail (JPG / PNG / WebP)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="w-full text-[11px] text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-container file:text-primary hover:file:bg-surface-container-high"
                  />
                  {thumbnailPreview && (
                    <div className="mt-2 relative w-24 h-16 rounded-lg overflow-hidden ghost-border">
                      <Image
                        src={thumbnailPreview}
                        alt="Preview thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t ghost-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high font-semibold text-on-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {formLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                  )}
                  <span>{editingArticle ? "Simpan Perubahan" : "Publikasikan Artikel"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-xl w-full p-6 ghost-border shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b ghost-border">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                Pratinjau Artikel
              </span>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {previewArticle.thumbnail_path && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden ghost-border bg-surface-container">
                <Image
                  src={previewArticle.thumbnail_path}
                  alt={previewArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <span className="text-[11px] text-on-surface-variant">
                {new Date(previewArticle.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <h2 className="font-headline text-xl font-bold text-primary mt-1">
                {previewArticle.title}
              </h2>
              <p className="font-body text-xs text-secondary font-medium italic mt-1">
                &ldquo;{previewArticle.excerpt}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t ghost-border font-body text-xs text-on-surface leading-relaxed whitespace-pre-line">
              {previewArticle.content}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="px-5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
