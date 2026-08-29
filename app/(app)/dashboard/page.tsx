import { KpiCards } from "@/components/dashboard/kpi-cards"
import { PriorityPatients } from "@/components/dashboard/priority-patients"
import { ReferralStatus } from "@/components/dashboard/referral-status"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { currentUser } from "@/lib/mock-data"

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
          {greeting()}, {currentUser.shortName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is your facility&apos;s healthcare activity today.
        </p>
      </div>

      <KpiCards />

      <QuickActions />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PriorityPatients />
        </div>
        <div>
          <ReferralStatus />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
