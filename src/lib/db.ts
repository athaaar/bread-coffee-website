/**
 * The Daily Knead - Database Client
 * Menghubungkan Next.js ke Google Apps Script Web App
 * Dilengkapi dengan persistent local fallback ketika APPS_SCRIPT_URL belum disetel
 */

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
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

// In-Memory Global Mock Store untuk pengembangan lokal sebelum Apps Script terhubung
declare global {
  // eslint-disable-next-line no-var
  var __localDbStore: {
    Roles: Role[];
    Users: User[];
    News: NewsArticle[];
  } | undefined;
}

function getInitialLocalStore(): { Roles: Role[]; Users: User[]; News: NewsArticle[] } {
  const now = new Date().toISOString();
  return {
    Roles: [
      {
        id: "role-admin",
        name: "admin",
        description: "Administrator dengan akses penuh ke seluruh sistem",
        permissions: "all",
        is_system: true,
        created_at: now,
      },
      {
        id: "role-user",
        name: "user",
        description: "Pengguna standar / customer terdaftar",
        permissions: "read",
        is_system: true,
        created_at: now,
      },
    ],
    Users: [
      {
        id: "user-admin-default",
        name: "Ghaisan Athar (Admin)",
        email: "admin@gmail.com",
        // Password hash bcrypt untuk '123456'
        password_hash: "$2a$10$LfjDjtXuxp3myVUu5e9FV.0NMXYqKHWLiDl4LNRjqpt80EWOi0iY2",
        role_id: "role-admin",
        status: "active" as const,
        created_at: now,
        updated_at: now,
      },
    ],
    News: [
      {
        id: "news-1",
        title: "Rahasia Kerak Renyah dan Rongga Sourdough yang Sempurna",
        slug: "rahasia-kerak-renyah-dan-rongga-sourdough",
        excerpt:
          "Mengenal teknik autolyse, hidrasi adonan, dan temperatur oven batu dalam menghasilkan roti ragi alami beraroma karamel.",
        content:
          "Proses pembuatan sourdough autentik menuntut kesabaran ekstra. Melalui fermentasi lambat 24 jam dengan starter ragi alami pilihan, struktur gluten terurai perlahan menghasilkan rongga remah (open crumb) yang elastis dan lapisan kulit luar yang garing renyah.",
        thumbnail_path: "/images/article-1.png",
        status: "published" as const,
        author_id: "user-admin-default",
        created_at: now,
        updated_at: now,
      },
      {
        id: "news-2",
        title: "Menjelajahi Cita Rasa Biji Kopi Gayo Honey Process",
        slug: "menjelajahi-cita-rasa-biji-kopi-gayo-honey",
        excerpt:
          "Bagaimana proses fermentasi honey menghasilkan keasaman buah manis seimbang yang berpadu serasi dengan roti shokupan mentega.",
        content:
          "Biji kopi Aceh Gayo dengan metode honey processing menyisakan sebagian mucilage manis saat penjemuran. Hasil seduhannya menghadirkan profil floral dengan sentuhan madu dan karamel yang sangat selaras dipadukan bersama kelembutan shokupan kami.",
        thumbnail_path: "/images/article-2.png",
        status: "published" as const,
        author_id: "user-admin-default",
        created_at: now,
        updated_at: now,
      },
      {
        id: "news-3",
        title: "Mengapa Roti Fermentasi Lambat Lebih Ramah untuk Pencernaan",
        slug: "mengapa-roti-fermentasi-lambat-ramah-pencernaan",
        excerpt:
          "Penjelasan mengapa fermentasi alami 24 jam memecah gluten dan asam fitat sehingga lebih bernutrisi, lezat, dan ringan di perut.",
        content:
          "Banyak orang yang sensitif terhadap gluten merasa lebih nyaman menikmati roti artisan fermentasi alami. Selama 24 jam fermentasi liar, bakteri asam laktat mendegradasi karbohidrat kompleks dan fitat, membuat penyerapan mineral lebih optimal.",
        thumbnail_path: "/images/article-3.png",
        status: "published" as const,
        author_id: "user-admin-default",
        created_at: now,
        updated_at: now,
      },
    ],
  };
}

const localStore = globalThis.__localDbStore ?? (globalThis.__localDbStore = getInitialLocalStore());

export async function queryDatabase<T>(
  action: "list" | "find" | "insert" | "update" | "delete",
  table: "Roles" | "Users" | "News",
  options?: {
    id?: string;
    data?: any;
    query?: Record<string, any>;
  }
): Promise<{ success: boolean; data?: T; error?: string }> {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  const appsScriptSecret = process.env.APPS_SCRIPT_SECRET;

  // Jika URL Apps Script sudah dikonfigurasi, kirim HTTP request ke Google Apps Script
  if (appsScriptUrl && appsScriptUrl.startsWith("http")) {
    try {
      const res = await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          table,
          secret: appsScriptSecret,
          id: options?.id,
          data: options?.data,
          query: options?.query,
        }),
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Apps Script responded with HTTP status ${res.status}`);
      }

      const json = await res.json();
      return json;
    } catch (err: any) {
      console.error("[AppsScript Error]:", err.message);
      // Fallback ke localStore jika fetch gagal (misal saat proses build prerendering di Vercel)
      const fallbackTableData: any[] = localStore[table] as any[];
      if (action === "list") {
        return { success: true, data: [...fallbackTableData] as any };
      }
      return { success: false, error: err.message };
    }
  }

  // --- Fallback Local Mock Store ---
  const tableData: any[] = localStore[table] as any[];

  if (action === "list") {
    if (!options?.query) {
      return { success: true, data: [...tableData] as any };
    }
    const filtered = tableData.filter((item) => {
      for (const key in options.query) {
        if (String(item[key]) !== String(options.query[key])) return false;
      }
      return true;
    });
    return { success: true, data: filtered as any };
  }

  if (action === "find") {
    const found = tableData.find((item) => {
      for (const key in options?.query) {
        if (String(item[key]) !== String(options?.query?.[key])) return false;
      }
      return true;
    });
    return { success: true, data: (found ? { ...found } : null) as any };
  }

  if (action === "insert") {
    const now = new Date().toISOString();
    const newItem = {
      id: options?.data?.id || `id_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...options?.data,
      created_at: options?.data?.created_at || now,
      updated_at: now,
    };
    tableData.push(newItem);
    return { success: true, data: newItem as any };
  }

  if (action === "update") {
    const idx = tableData.findIndex((item) => String(item.id) === String(options?.id));
    if (idx === -1) {
      return { success: false, error: `Record with id ${options?.id} not found` };
    }
    const updated = {
      ...tableData[idx],
      ...options?.data,
      updated_at: new Date().toISOString(),
    };
    tableData[idx] = updated;
    return { success: true, data: updated as any };
  }

  if (action === "delete") {
    const idx = tableData.findIndex((item) => String(item.id) === String(options?.id));
    if (idx === -1) {
      return { success: false, error: `Record with id ${options?.id} not found` };
    }
    tableData.splice(idx, 1);
    return { success: true, data: { deletedId: options?.id } as any };
  }

  return { success: false, error: `Action ${action} unsupported` };
}
