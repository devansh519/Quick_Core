import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";


export default function AILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-canvas">
      <Sidebar role="ai_operator" basePath="/ai" />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader breadcrumbs={[{ label: "AI Operations" }]} searchPlaceholder="Search insights, models" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
