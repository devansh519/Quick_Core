import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";


export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-canvas">
      <Sidebar role="warehouse" basePath="/warehouse" />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader breadcrumbs={[{ label: "Warehouse" }]} searchPlaceholder="Search SKUs" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
