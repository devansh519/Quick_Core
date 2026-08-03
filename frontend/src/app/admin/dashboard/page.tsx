import { ReceiptText, IndianRupee, Users, Truck } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartContainer } from "@/components/dashboard/chart-container";
import { OrderTrendLineChart, OrderStatusPieChart } from "@/components/dashboard/charts";
import { AIInsightCard } from "@/components/ai/ai-insight-card";
import { RecommendationPanel } from "@/components/ai/recommendation-panel";

const ORDER_TREND = [
  { day: "Mon", orders: 412 }, { day: "Tue", orders: 388 }, { day: "Wed", orders: 455 },
  { day: "Thu", orders: 501 }, { day: "Fri", orders: 612 }, { day: "Sat", orders: 734 }, { day: "Sun", orders: 690 },
];

const ORDER_STATUS = [
  { name: "Delivered", value: 62, color: "var(--success)" },
  { name: "Out for delivery", value: 18, color: "var(--insight-amber)" },
  { name: "Preparing", value: 12, color: "var(--warning)" },
  { name: "Cancelled", value: 8, color: "var(--error)" },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">Operational overview across QuickCore.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Orders today" value="3,792" icon={ReceiptText} trend={{ value: "+12.4% vs yesterday", positive: true }} />
        <MetricCard label="Revenue today" value="₹4,82,150" icon={IndianRupee} trend={{ value: "+8.1% vs yesterday", positive: true }} />
        <MetricCard label="Active customers" value="18,204" icon={Users} trend={{ value: "+2.3% this week", positive: true }} />
        <MetricCard label="Deliveries in flight" value="146" icon={Truck} trend={{ value: "-4.2% vs avg", positive: false }} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartContainer title="Order trend" description="Orders placed per day, last 7 days">
          <OrderTrendLineChart data={ORDER_TREND} />
        </ChartContainer>
        <ChartContainer title="Order status distribution" description="Current order pipeline">
          <OrderStatusPieChart data={ORDER_STATUS} />
        </ChartContainer>
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-text-primary">AI operational insights</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <AIInsightCard
            title="Demand spike expected in Dadri zone"
            description="Weekend demand for dairy products is trending 22% above baseline."
            confidence={87}
          />
          <RecommendationPanel
            title="Restock Amul Toned Milk at Warehouse 3"
            description="Current stock will deplete in ~14 hours at projected demand."
            confidence={91}
          />
        </div>
      </div>
    </div>
  );
}
