import { CustomerTopNav } from "@/components/layout/customer-top-nav";
import { CustomerBottomNav } from "@/components/layout/customer-bottom-nav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
      <CustomerTopNav />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-20 pt-6 md:px-6 md:pb-10">{children}</main>
      <CustomerBottomNav />
    </div>
  );
}
