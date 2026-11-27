import { NextResponse } from "next/server";
import { queryDatabase, User, Role } from "@/lib/db";
import { comparePassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Cari user di Google Spreadsheet / Database
    const userRes = await queryDatabase<User>("find", "Users", {
      query: { email: email.trim().toLowerCase() },
    });

    const user = userRes.data;
    if (!user || !user.password_hash) {
      return NextResponse.json(
        { success: false, error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Akun ini sedang dinonaktifkan. Silakan hubungi administrator." },
        { status: 403 }
      );
    }

    // 2. Verifikasi Password Hash
    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Email atau password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // 3. Ambil Role User
    let roleName = "user";
    const roleRes = await queryDatabase<Role>("find", "Roles", {
      query: { id: user.role_id },
    });
    if (roleRes.data) {
      roleName = roleRes.data.name;
    }

    // 4. Generate Session Token & Set HttpOnly Cookie
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: roleName,
      roleId: user.role_id,
    });

    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
      },
    });
  } catch (err: any) {
    console.error("[Login API Error]:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat memproses login." },
      { status: 500 }
    );
  }
}
