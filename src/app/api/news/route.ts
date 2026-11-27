import { NextResponse } from "next/server";
import { queryDatabase, NewsArticle } from "@/lib/db";

export async function GET() {
  try {
    const res = await queryDatabase<NewsArticle[]>("list", "News", {
      query: { status: "published" },
    });

    const articles = (res.data || []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ success: true, data: articles });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
