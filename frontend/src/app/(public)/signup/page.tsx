"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-brand-signal text-white">
            <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-semibold text-text-primary">Create your account</h1>
          <p className="text-sm text-text-secondary">Groceries delivered in minutes, not hours.</p>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: wire to POST /api/v1/auth/signup once features/auth is implemented
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Ananya Rao" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" required />
          </div>
          <Button type="submit" className="mt-2 w-full">Create account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="font-medium text-brand-signal hover:underline">Log in</Link>
        </p>
      </Card>
    </main>
  );
}
