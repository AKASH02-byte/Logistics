function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const supabaseEnv = {
  get url() {
    const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!value) throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
    return value;
  },
  get anonKey() {
    const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!value) throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return value;
  },
  get serviceRoleKey() {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
};
