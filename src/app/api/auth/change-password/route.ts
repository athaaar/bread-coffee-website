import { NextResponse } from "next/server";
import { queryDatabase, User } from "@/lib/db";
import { getSession, comparePassword, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { old_password, new_password } = await request.json();

    if (!old_password || !new_password) {
      return NextResponse.json(
        { success: false, error: "Password lama dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    // Ambil data user saat ini
    const userRes = await queryDatabase<User>("find", "Users", {
      query: { id: session.userId },
    });

    const user = userRes.data;
    if (!user || !user.password_hash) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan." }, { status: 404 });
    }

    // Verifikasi password lama
    const isOldMatch = await comparePassword(old_password, user.password_hash);
    if (!isOldMatch) {
      return NextResponse.json({ success: false, error: "Password lama yang Anda masukkan salah." }, { status: 400 });
    }

    // Hash password baru dan simpan
    const newHash = await hashPassword(new_password);
    await queryDatabase("update", "Users", {
      id: user.id,
      data: { password_hash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui. Silakan gunakan password baru ini pada login berikutnya.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
