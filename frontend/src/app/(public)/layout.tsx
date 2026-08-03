import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-canvas">
      <header className="border-b border-border-default">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:px-6">
          <Link href="/welcome" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-brand-signal text-white">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-semibold text-text-primary">QuickCore</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/login" className="text-text-secondary hover:text-text-primary">Log in</Link>
            <Link href="/signup" className="rounded-[var(--radius-md)] bg-brand-signal px-3 py-1.5 font-medium text-white hover:bg-brand-signal-hover">Sign up</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
