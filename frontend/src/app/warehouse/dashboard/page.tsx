import { Boxes, AlertTriangle, ArrowLeftRight, TrendingDown } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartContainer } from "@/components/dashboard/chart-container";
import { InventoryAreaChart } from "@/components/dashboard/charts";
import { RecommendationPanel } from "@/components/ai/recommendation-panel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InventoryBadge } from "@/components/commerce/inventory-badge";

const STOCK_TREND = [
  { day: "Mon", stock: 4200 }, { day: "Tue", stock: 3950 }, { day: "Wed", stock: 4100 },
  { day: "Thu", stock: 3700 }, { day: "Fri", stock: 3400 }, { day: "Sat", stock: 2950 }, { day: "Sun", stock: 3100 },
];

const LOW_STOCK = [
  { sku: "SKU-1045", name: "Lay's Classic Salted", status: "critical" as const },
  { sku: "SKU-1043", name: "Fortune Sunflower Oil", status: "low" as const },
  { sku: "SKU-1051", name: "Maggi Noodles", status: "low" as const },
];

export default function WarehouseDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Warehouse 3 &mdash; Dadri</h1>
        <p className="text-sm text-text-secondary">Inventory overview and restocking alerts.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="SKUs tracked" value="1,240" icon={Boxes} />
        <MetricCard label="Low stock alerts" value="14" icon={AlertTriangle} trend={{ value: "+3 today", positive: false }} />
        <MetricCard label="Pending transfers" value="6" icon={ArrowLeftRight} />
        <MetricCard label="Stock turnover" value="3.2x" icon={TrendingDown} trend={{ value: "-0.4x this month", positive: false }} />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_320px]">
        <ChartContainer title="Total stock level" description="Units on hand, last 7 days">
          <InventoryAreaChart data={STOCK_TREND} />
        </ChartContainer>

        <Card>
          <CardHeader>
            <CardTitle>Restocking alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {LOW_STOCK.map((item) => (
              <div key={item.sku} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.name}</p>
                  <p className="font-mono text-xs text-text-muted">{item.sku}</p>
                </div>
                <InventoryBadge status={item.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-text-primary">AI restocking recommendations</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <RecommendationPanel
            title="Reorder Lay's Classic Salted"
            description="Suggested quantity: 480 units, based on 14-day demand trend."
            confidence={89}
          />
          <RecommendationPanel
            title="Reorder Fortune Sunflower Oil"
            description="Suggested quantity: 210 units, based on weekend demand spike."
            confidence={76}
          />
        </div>
      </div>
    </div>
  );
}
