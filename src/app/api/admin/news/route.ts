import { NextResponse } from "next/server";
import { queryDatabase, NewsArticle } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { saveFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const newsRes = await queryDatabase<NewsArticle[]>("list", "News");
    const articles = (newsRes.data || []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return NextResponse.json({ success: true, data: articles });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }

    let title = "";
    let excerpt = "";
    let content = "";
    let status: "published" | "draft" = "draft";
    let thumbnailPath = "/images/article-1.png";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = (formData.get("title") as string) || "";
      excerpt = (formData.get("excerpt") as string) || "";
      content = (formData.get("content") as string) || "";
      status = (formData.get("status") as any) === "published" ? "published" : "draft";

      const file = formData.get("thumbnail") as File | null;
      if (file && file.size > 0) {
        const uploadRes = await saveFile(file);
        if (!uploadRes.success || !uploadRes.filePath) {
          return NextResponse.json(
            { success: false, error: uploadRes.error || "Gagal mengunggah thumbnail." },
            { status: 400 }
          );
        }
        thumbnailPath = uploadRes.filePath;
      } else if (formData.get("thumbnail_path")) {
        thumbnailPath = formData.get("thumbnail_path") as string;
      }
    } else {
      const body = await request.json();
      title = body.title || "";
      excerpt = body.excerpt || "";
      content = body.content || "";
      status = body.status === "published" ? "published" : "draft";
      if (body.thumbnail_path) thumbnailPath = body.thumbnail_path;
    }

    if (!title) {
      return NextResponse.json({ success: false, error: "Judul berita wajib diisi." }, { status: 400 });
    }

    const slug = slugify(title) || `berita-${Date.now()}`;

    const newArticle = await queryDatabase<NewsArticle>("insert", "News", {
      data: {
        id: `news_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        thumbnail_path: thumbnailPath,
        status,
        author_id: session.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil ditambahkan.",
      data: newArticle.data,
    });
  } catch (err: any) {
    console.error("[Create News Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
