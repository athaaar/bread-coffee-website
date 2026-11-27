import { NextResponse } from "next/server";
import { queryDatabase, User, Role } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const usersRes = await queryDatabase<User[]>("list", "Users");
    const rolesRes = await queryDatabase<Role[]>("list", "Roles");

    const rolesMap = new Map<string, string>();
    (rolesRes.data || []).forEach((r) => rolesMap.set(r.id, r.name));

    const safeUsers = (usersRes.data || []).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role_id: u.role_id,
      role_name: rolesMap.get(u.role_id) || "user",
      status: u.status,
      created_at: u.created_at,
      updated_at: u.updated_at,
    }));

    return NextResponse.json({ success: true, data: safeUsers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }

    const { id, role_id, status } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "ID user wajib disertakan" }, { status: 400 });
    }

    // Proteksi: Admin tidak boleh menonaktifkan dirinya sendiri
    if (id === session.userId && status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menonaktifkan akun Anda sendiri." },
        { status: 400 }
      );
    }

    const updateData: Partial<User> = {};
    if (role_id) updateData.role_id = role_id;
    if (status) updateData.status = status;

    const res = await queryDatabase<User>("update", "Users", {
      id,
      data: updateData,
    });

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "User berhasil diperbarui.", data: res.data });
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
      return NextResponse.json({ success: false, error: "ID user wajib disertakan" }, { status: 400 });
    }

    // Proteksi: Admin tidak boleh menghapus dirinya sendiri
    if (id === session.userId) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    // Proteksi: Jangan hapus admin terakhir
    const allUsers = await queryDatabase<User[]>("list", "Users");
    const roles = await queryDatabase<Role[]>("list", "Roles");
    const adminRole = (roles.data || []).find((r) => r.name === "admin");
    const activeAdmins = (allUsers.data || []).filter(
      (u) => u.role_id === adminRole?.id && u.status === "active"
    );

    const targetUser = (allUsers.data || []).find((u) => u.id === id);
    if (targetUser?.role_id === adminRole?.id && activeAdmins.length <= 1) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menghapus satu-satunya admin aktif sistem." },
        { status: 400 }
      );
    }

    const res = await queryDatabase("delete", "Users", { id });
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "User berhasil dihapus." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
