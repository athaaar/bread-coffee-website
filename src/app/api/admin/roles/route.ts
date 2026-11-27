import { NextResponse } from "next/server";
import { queryDatabase, Role, User } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const rolesRes = await queryDatabase<Role[]>("list", "Roles");
    return NextResponse.json({ success: true, data: rolesRes.data || [] });
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

    const { name, description, permissions } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, error: "Nama role wajib diisi." }, { status: 400 });
    }

    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "_");

    // Cek apakah role sudah ada
    const existingRole = await queryDatabase<Role>("find", "Roles", {
      query: { name: cleanName },
    });

    if (existingRole.data) {
      return NextResponse.json(
        { success: false, error: `Role '${cleanName}' sudah terdaftar.` },
        { status: 400 }
      );
    }

    const newRoleRes = await queryDatabase<Role>("insert", "Roles", {
      data: {
        id: `role_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: cleanName,
        description: description?.trim() || "",
        permissions: permissions || "read",
        is_system: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Role '${cleanName}' berhasil ditambahkan.`,
      data: newRoleRes.data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID role wajib disertakan." }, { status: 400 });
    }

    const targetRole = await queryDatabase<Role>("find", "Roles", { query: { id } });
    if (!targetRole.data) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan." }, { status: 404 });
    }

    // Proteksi: Role bawaan sistem tidak boleh dihapus
    if (targetRole.data.is_system) {
      return NextResponse.json(
        { success: false, error: "Role bawaan sistem tidak boleh dihapus demi integritas aplikasi." },
        { status: 400 }
      );
    }

    // Cek apakah ada user yang sedang menggunakan role ini
    const usersWithRole = await queryDatabase<User[]>("list", "Users", { query: { role_id: id } });
    if (usersWithRole.data && usersWithRole.data.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Tidak dapat menghapus role ini karena masih digunakan oleh ${usersWithRole.data.length} pengguna.`,
        },
        { status: 400 }
      );
    }

    await queryDatabase("delete", "Roles", { id });
    return NextResponse.json({ success: true, message: "Role berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
