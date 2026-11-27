import { NextResponse } from "next/server";
import { queryDatabase, User, Role } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Cek apakah email sudah terdaftar
    const existingUser = await queryDatabase<User>("find", "Users", {
      query: { email: cleanEmail },
    });

    if (existingUser.data) {
      return NextResponse.json(
        { success: false, error: "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain." },
        { status: 400 }
      );
    }

    // 2. Ambil ID Role User
    let userRoleId = "role-user";
    const roleRes = await queryDatabase<Role>("find", "Roles", {
      query: { name: "user" },
    });
    if (roleRes.data) {
      userRoleId = roleRes.data.id;
    }

    // 3. Hash Password dengan bcrypt
    const passwordHash = await hashPassword(password);

    // 4. Simpan User Baru ke Google Spreadsheet / Database
    const newUserRes = await queryDatabase<User>("insert", "Users", {
      data: {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        email: cleanEmail,
        password_hash: passwordHash,
        role_id: userRoleId,
        status: "active",
      },
    });

    if (!newUserRes.success || !newUserRes.data) {
      throw new Error(newUserRes.error || "Gagal menyimpan akun baru ke database.");
    }

    // 5. Generate Session Token & Login Otomatis
    const token = await createSessionToken({
      userId: newUserRes.data.id,
      email: newUserRes.data.email,
      name: newUserRes.data.name,
      role: "user",
      roleId: userRoleId,
    });

    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Registrasi akun berhasil.",
      user: {
        id: newUserRes.data.id,
        name: newUserRes.data.name,
        email: newUserRes.data.email,
        role: "user",
      },
    });
  } catch (err: any) {
    console.error("[Register API Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan server saat mendaftar." },
      { status: 500 }
    );
  }
}
