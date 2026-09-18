import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Help / Support", href: "/support" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200/70 bg-white/70 px-6 py-4 backdrop-blur-xl sm:px-8">
      <div className="flex flex-col gap-3 text-xs text-gray-500 lg:flex-row lg:items-center lg:justify-between">
        <p className="shrink-0">© 2026 AGK Logistics &amp; Infrastructure ERP. All rights reserved.</p>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-gray-900">
              {link.label}
            </Link>
          ))}
          <Link href="/status" className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]" />
            System Status
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3 text-gray-400">
          <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-[10px] font-semibold text-gray-500">v1.2.0</span>
          <span className="font-medium text-gray-600">AGK Logistics</span>
        </div>
      </div>
    </footer>
  );
}
