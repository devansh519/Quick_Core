import { ChartContainer } from "@/components/dashboard/chart-container";
import { DemandForecastChart } from "@/components/dashboard/charts";

const DATA = [
  { day: "Mon", actual: 412, predicted: 405 },
  { day: "Tue", actual: 388, predicted: 395 },
  { day: "Wed", actual: 455, predicted: 440 },
  { day: "Thu", actual: 501, predicted: 510 },
  { day: "Fri", actual: 612, predicted: 590 },
  { day: "Sat", predicted: 745 },
  { day: "Sun", predicted: 702 },
];

export default function DemandForecastPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Demand Forecast</h1>
        <p className="text-sm text-text-secondary">
          Solid blue is observed order volume. Dashed amber is the model&apos;s prediction &mdash; the chart-level expression of the Confidence Edge.
        </p>
      </div>
      <ChartContainer title="Orders: actual vs. predicted" description="Last 5 days actual, next 2 days predicted">
        <DemandForecastChart data={DATA} />
      </ChartContainer>
    </div>
  );
}
