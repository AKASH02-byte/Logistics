"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle } from "lucide-react";

export function LogoutButton({ endpoint }: { endpoint: "/api/admin/logout" | "/api/driver/logout" }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const response = await fetch(endpoint, { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      router.replace("/login");
      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      aria-label={isSigningOut ? "Signing out" : "Log out"}
      className="group relative flex min-h-10 items-center gap-2 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 text-xs font-bold text-slate-300 shadow-lg shadow-slate-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-200 disabled:cursor-wait disabled:opacity-80"
    >
      <span className="absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-amber-400/15 to-transparent transition-all duration-500 group-hover:w-full" />
      <span className="relative flex items-center gap-2">
        {isSigningOut ? (
          <LoaderCircle className="h-4 w-4 animate-spin text-amber-300" />
        ) : (
          <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
        <span>{isSigningOut ? "Signing out" : "Log out"}</span>
      </span>
    </button>
  );
}
