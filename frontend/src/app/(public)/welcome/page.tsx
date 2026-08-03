import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-6 md:py-28">
        <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-border-default bg-bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
          <Sparkles className="h-3 w-3 text-insight-amber" /> AI-native commerce operating system
        </span>
        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-text-primary md:text-5xl">
          Backend executes. AI observes. You approve.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary">
          QuickCore runs quick-commerce operations with deterministic precision, and lets AI
          recommend what happens next &mdash; never decide it for you.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg">Get started <ArrowRight className="h-4 w-4" /></Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="secondary">Log in</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-24 md:grid-cols-3 md:px-6">
        <Card className="p-6">
          <ShieldCheck className="h-5 w-5 text-brand-signal" />
          <p className="mt-3 text-[15px] font-semibold text-text-primary">Backend truth, always authoritative</p>
          <p className="mt-1 text-sm text-text-secondary">Every order, price, and stock level you see is a deterministic fact from the system of record.</p>
        </Card>
        <Card className="p-6">
          <Sparkles className="h-5 w-5 text-insight-amber" />
          <p className="mt-3 text-[15px] font-semibold text-text-primary">AI recommends, never decides</p>
          <p className="mt-1 text-sm text-text-secondary">Demand forecasts, ETAs, and restocking suggestions are clearly marked and always reviewed by a human.</p>
        </Card>
        <Card className="p-6">
          <Gauge className="h-5 w-5 text-brand-signal" />
          <p className="mt-3 text-[15px] font-semibold text-text-primary">Built for operational speed</p>
          <p className="mt-1 text-sm text-text-secondary">Every workflow &mdash; from placing an order to assigning a delivery &mdash; is designed to take the fewest clicks possible.</p>
        </Card>
      </section>
    </main>
  );
}
