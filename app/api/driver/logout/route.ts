import { cookies } from "next/headers";
import { LABOUR_SESSION_COOKIE } from "@/lib/auth/labour-session";
import { jsonOk } from "@/lib/api/response";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(LABOUR_SESSION_COOKIE);
  return jsonOk({ success: true });
}
