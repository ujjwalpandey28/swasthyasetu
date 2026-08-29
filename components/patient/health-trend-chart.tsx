"use client"

import { patientProfile } from "@/lib/mock-data"

export function HealthTrendChart() {
  const data = patientProfile.bpTrend
  const w = 520
  const h = 180
  const padX = 16
  const padY = 22
  const min = 80
  const max = 165

  const x = (i: number) =>
    padX + (i * (w - padX * 2)) / (data.length - 1)
  const y = (v: number) =>
    h - padY - ((v - min) / (max - min)) * (h - padY * 2)

  const line = (key: "systolic" | "diastolic") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[key])}`).join(" ")

  const area =
    `M ${x(0)} ${y(data[0].systolic)} ` +
    data.map((d, i) => `L ${x(i)} ${y(d.systolic)}`).join(" ") +
    ` L ${x(data.length - 1)} ${h - padY} L ${x(0)} ${h - padY} Z`

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2.5 rounded-full bg-teal" /> Systolic
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="size-2.5 rounded-full bg-navy/60" /> Diastolic
        </span>
        <span className="ml-auto text-muted-foreground">Target &lt; 130/80</span>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-44 w-full"
        role="img"
        aria-label="Blood pressure trend from October 2025 to August 2026, gradually declining"
      >
        <defs>
          <linearGradient id="bpArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-teal)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-teal)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* target band */}
        <line
          x1={padX}
          x2={w - padX}
          y1={y(130)}
          y2={y(130)}
          stroke="var(--color-border)"
          strokeDasharray="4 4"
        />

        <path d={area} fill="url(#bpArea)" />
        <path
          d={line("systolic")}
          fill="none"
          stroke="var(--color-teal)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={line("diastolic")}
          fill="none"
          stroke="var(--color-navy)"
          strokeOpacity={0.55}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => (
          <g key={d.label}>
            <circle cx={x(i)} cy={y(d.systolic)} r={3.5} fill="var(--color-teal)" />
            <text
              x={x(i)}
              y={h - 6}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: 10 }}
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
