import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "arrahman_secret_auth_key_v2_2026_locked";

export function verifyToken(token?: string): boolean {
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function verifyAdminSession(): Promise<{ valid: boolean; username?: string; role?: string; id?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return { valid: false };

    const decoded: any = jwt.verify(token, JWT_SECRET);
    return { valid: true, username: decoded.username, role: decoded.role || "admin", id: decoded.id };
  } catch {
    return { valid: false };
  }
}


