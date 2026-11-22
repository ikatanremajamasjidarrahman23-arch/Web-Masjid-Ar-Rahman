import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'arrahman_secret_auth_key_v2_2026_locked'
);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Cek apakah user sedang mengakses rute admin
  if (path.startsWith('/admin')) {
    // Abaikan rute login admin
    if (path === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    // Jika tidak ada token, arahkan langsung ke halaman login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verifikasi keaslian token JWT menggunakan secret terbaru
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      // Token tidak valid / sesi lama / palsu -> Hapus cookie dan paksa redirect ke /admin/login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
