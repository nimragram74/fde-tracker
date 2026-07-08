"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export function StatusDonut({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative h-[220px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid #e2e0e8", fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500">total</div>
        </div>
      </div>
    </div>
  );
}

export function WeeklyBars({ data }: { data: { week: string; done: number }[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eef0f5" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#5b5966" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#5b5966" }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "#f2f6fc" }}
            contentStyle={{ borderRadius: 10, border: "1px solid #e2e0e8", fontSize: 12 }}
          />
          <Bar dataKey="done" fill="#0a6ed1" radius={[5, 5, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendLine({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#eef0f5" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5b5966" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#5b5966" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e0e8", fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0e8a0e"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#0e8a0e" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
