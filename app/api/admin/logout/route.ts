import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/admin-session";
import { jsonOk } from "@/lib/api/response";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  return jsonOk({ success: true });
}
