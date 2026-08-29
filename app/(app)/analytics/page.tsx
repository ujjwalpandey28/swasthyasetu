"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartBar as BarChart3, TrendingUp, Activity, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2 } from "lucide-react"

import {
  avgReferralJourneyTime,
  commonConditions,
  followUpCompletion,
  highRiskDistribution,
  patientAccessTrend,
  referralCompletionRate,
} from "@/lib/mock-data"

const teal = "oklch(0.58 0.09 195)"
const navy = "oklch(0.24 0.035 250)"
const success = "oklch(0.62 0.14 155)"
const warning = "oklch(0.75 0.14 75)"
const urgent = "oklch(0.58 0.21 25)"
const blue = "oklch(0.62 0.11 230)"

const pieColors = [teal, blue, success, warning, urgent]

export default function AnalyticsPage() {
  // Derived metrics
  const totalScans = patientAccessTrend.reduce((s, d) => s + d.scans, 0)
  const totalConsults = patientAccessTrend.reduce((s, d) => s + d.consultations, 0)
  const avgCompletion = Math.round(
    (referralCompletionRate.reduce((s, d) => s + d.completed, 0) /
      referralCompletionRate.reduce((s, d) => s + d.total, 0)) *
      100,
  )
  const avgJourneyHrs = (
    avgReferralJourneyTime.reduce((s, d) => s + d.hours, 0) /
    avgReferralJourneyTime.length
  ).toFixed(1)
  const totalHighRisk = highRiskDistribution.reduce((s, d) => s + d.value, 0)
  const followUpRate = Math.round(
    (followUpCompletion.reduce((s, d) => s + d.completed, 0) /
      followUpCompletion.reduce((s, d) => s + d.scheduled, 0)) *
      100,
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-muted text-teal">
          <BarChart3 className="size-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Analytics
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Population health &amp; facility performance insights
          </p>
        </div>
      </div>

      {/* Demo Data label */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2.5">
        <span className="flex size-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
          D
        </span>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Demo Data</span> —
          illustrative figures for prototype demonstration, not live healthcare
          statistics.
        </p>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          icon={TrendingUp}
          label="Total Scans (6 mo)"
          value={totalScans.toLocaleString()}
          accent="bg-teal-muted text-teal"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Referral Completion"
          value={`${avgCompletion}%`}
          accent="bg-success-muted text-success"
        />
        <KpiCard
          icon={Clock}
          label="Avg Journey Time"
          value={`${avgJourneyHrs} hrs`}
          accent="bg-accent text-accent-foreground"
        />
        <KpiCard
          icon={AlertTriangle}
          label="High-Risk Patients"
          value={String(totalHighRisk)}
          accent="bg-urgent-muted text-urgent"
        />
      </div>

      {/* Patient Access Trend */}
      <ChartCard
        title="Patient Access Trend"
        subtitle="QR scans and consultations over the last 6 months"
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={patientAccessTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 235)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid oklch(0.92 0.01 235)",
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="scans" stroke={teal} strokeWidth={2.5} dot={{ r: 3 }} name="QR Scans" />
            <Line type="monotone" dataKey="consultations" stroke={navy} strokeWidth={2.5} dot={{ r: 3 }} name="Consultations" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Referral Completion Rate */}
        <ChartCard
          title="Referral Completion Rate"
          subtitle="Completed vs total referrals per month"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={referralCompletionRate} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 235)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid oklch(0.92 0.01 235)",
                  fontSize: 13,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="completed" stroke={success} strokeWidth={2.5} dot={{ r: 3 }} name="Completed" />
              <Line type="monotone" dataKey="total" stroke={navy} strokeWidth={2} strokeDasharray="5 5" dot={false} name="Total" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* High-Risk Patient Distribution */}
        <ChartCard
          title="High-Risk Patient Distribution"
          subtitle="Breakdown by condition category"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={highRiskDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={2}
              >
                {highRiskDistribution.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid oklch(0.92 0.01 235)",
                  fontSize: 13,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Most Common Conditions */}
        <ChartCard
          title="Most Common Conditions"
          subtitle="Patient count by diagnosed condition"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={commonConditions} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 235)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="condition"
                tick={{ fontSize: 11, fill: "oklch(0.52 0.02 250)" }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid oklch(0.92 0.01 235)",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="count" fill={teal} radius={[0, 6, 6, 0]} name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Follow-Up Completion */}
        <ChartCard
          title="Follow-Up Completion"
          subtitle="Scheduled vs completed follow-ups"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={followUpCompletion} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 235)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid oklch(0.92 0.01 235)",
                  fontSize: 13,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="scheduled" fill={navy} radius={[4, 4, 0, 0]} name="Scheduled" />
              <Bar dataKey="completed" fill={success} radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Average Referral Journey Time */}
      <ChartCard
        title="Average Referral Journey Time"
        subtitle="Hours from referral creation to acceptance by facility"
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={avgReferralJourneyTime} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 235)" vertical={false} />
            <XAxis dataKey="facility" tick={{ fontSize: 11, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "oklch(0.52 0.02 250)" }} axisLine={false} tickLine={false} unit="h" />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid oklch(0.92 0.01 235)",
                fontSize: 13,
              }}
            />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]} name="Avg Hours">
              {avgReferralJourneyTime.map((d, i) => (
                <Cell key={i} fill={d.hours > 4 ? urgent : d.hours > 3 ? warning : teal} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Follow-up completion summary */}
      <div className="flex items-center gap-3 rounded-2xl border border-success/25 bg-success-muted/30 p-5">
        <span className="flex size-11 items-center justify-center rounded-xl bg-success text-success-foreground">
          <Activity className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Follow-Up Completion Rate: {followUpRate}%
          </p>
          <p className="text-xs text-muted-foreground">
            {followUpCompletion.reduce((s, d) => s + d.completed, 0)} of{" "}
            {followUpCompletion.reduce((s, d) => s + d.scheduled, 0)} follow-ups
            completed over the last 6 months.
          </p>
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Activity
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <span className={`flex size-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="size-5" />
      </span>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  )
}
