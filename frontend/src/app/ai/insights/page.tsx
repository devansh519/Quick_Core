import { Sparkles, TrendingUp, ShieldAlert, Gauge } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AIInsightCard } from "@/components/ai/ai-insight-card";
import { RecommendationPanel } from "@/components/ai/recommendation-panel";

export default function AIDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">AI Operations</h1>
        <p className="text-sm text-text-secondary">
          Every value below is a prediction, marked with the Confidence Edge. AI recommends &mdash; it never executes on its own.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Active insights" value="23" icon={Sparkles} />
        <MetricCard label="Avg. confidence" value="84%" icon={Gauge} />
        <MetricCard label="Pending approvals" value="7" icon={TrendingUp} />
        <MetricCard label="Fraud flags today" value="3" icon={ShieldAlert} />
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-text-primary">Pending recommendations</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <RecommendationPanel
            title="Reorder Lay's Classic Salted at Warehouse 3"
            description="Suggested quantity: 480 units, based on 14-day demand trend."
            confidence={89}
          />
          <RecommendationPanel
            title="Flag order #48221 for fraud review"
            description="Unusual order pattern: 3 high-value orders from a new account within 10 minutes."
            confidence={72}
          />
          <RecommendationPanel
            title="Increase driver allocation, Dadri zone"
            description="Predicted 30% surge in orders between 7\u20139 PM this evening."
            confidence={81}
          />
          <RecommendationPanel
            title="Reorder Fortune Sunflower Oil at Warehouse 3"
            description="Suggested quantity: 210 units, based on weekend demand spike."
            confidence={76}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-text-primary">Operational insights</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <AIInsightCard
            title="Demand forecast accuracy improved"
            description="Last week's demand predictions were within 6% of actuals, up from 11%."
            confidence={94}
          />
          <AIInsightCard
            title="ETA confidence dipped in Sector 62"
            description="Traffic pattern changes have reduced ETA prediction confidence for this zone."
            confidence={63}
          />
        </div>
      </div>
    </div>
  );
}
