import { NextResponse } from "next/server";
import { queryDatabase, NewsArticle } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { saveFile, deleteFile } from "@/lib/storage";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const articleRes = await queryDatabase<NewsArticle>("find", "News", {
      query: { id: params.id },
    });
    if (!articleRes.data) {
      return NextResponse.json({ success: false, error: "Berita tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: articleRes.data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }

    const targetArticle = await queryDatabase<NewsArticle>("find", "News", {
      query: { id: params.id },
    });
    if (!targetArticle.data) {
      return NextResponse.json({ success: false, error: "Berita tidak ditemukan." }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";
    const updateData: Partial<NewsArticle> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      if (formData.has("title")) {
        const title = (formData.get("title") as string).trim();
        updateData.title = title;
        updateData.slug = slugify(title);
      }
      if (formData.has("excerpt")) updateData.excerpt = (formData.get("excerpt") as string).trim();
      if (formData.has("content")) updateData.content = (formData.get("content") as string).trim();
      if (formData.has("status")) {
        updateData.status = (formData.get("status") as any) === "published" ? "published" : "draft";
      }

      const file = formData.get("thumbnail") as File | null;
      if (file && file.size > 0) {
        const uploadRes = await saveFile(file);
        if (uploadRes.success && uploadRes.filePath) {
          // Hapus file thumbnail lama jika ada di /uploads/
          if (targetArticle.data.thumbnail_path?.startsWith("/uploads/")) {
            await deleteFile(targetArticle.data.thumbnail_path);
          }
          updateData.thumbnail_path = uploadRes.filePath;
        }
      } else if (formData.get("thumbnail_path")) {
        updateData.thumbnail_path = formData.get("thumbnail_path") as string;
      }
    } else {
      const body = await request.json();
      if (body.title) {
        updateData.title = body.title.trim();
        updateData.slug = slugify(body.title);
      }
      if (body.excerpt !== undefined) updateData.excerpt = body.excerpt.trim();
      if (body.content !== undefined) updateData.content = body.content.trim();
      if (body.status) updateData.status = body.status === "published" ? "published" : "draft";
      if (body.thumbnail_path) updateData.thumbnail_path = body.thumbnail_path;
    }

    const updateRes = await queryDatabase<NewsArticle>("update", "News", {
      id: params.id,
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Berita berhasil diperbarui.",
      data: updateRes.data,
    });
  } catch (err: any) {
    console.error("[Update News Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }

    const targetArticle = await queryDatabase<NewsArticle>("find", "News", {
      query: { id: params.id },
    });

    if (targetArticle.data?.thumbnail_path?.startsWith("/uploads/")) {
      await deleteFile(targetArticle.data.thumbnail_path);
    }

    await queryDatabase("delete", "News", { id: params.id });
    return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
