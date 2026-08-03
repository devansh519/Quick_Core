"use client";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const tooltipStyle = {
  background: "var(--bg-surface-raised)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-md)",
  fontSize: "12px",
  color: "var(--text-primary)",
};

const axisStyle = { fontSize: 12, fill: "var(--text-muted)" };

export function OrderTrendLineChart({ data }: { data: { day: string; orders: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="orders" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RevenueBarChart({ data }: { data: { category: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
        <XAxis dataKey="category" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="revenue" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function InventoryAreaChart({ data }: { data: { day: string; stock: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="stock" stroke="var(--chart-2)" fill="url(#stockFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OrderStatusPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/**
 * Demand Forecast: predicted series renders in Insight Amber with a dashed
 * stroke; actual series in Signal Blue solid — the chart-level expression
 * of the Confidence Edge rule.
 */
export function DemandForecastChart({ data }: { data: { day: string; actual?: number; predicted?: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--brand-signal)" strokeWidth={2} dot={false} />
        <Line
          type="monotone"
          dataKey="predicted"
          name="Predicted"
          stroke="var(--insight-amber)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
