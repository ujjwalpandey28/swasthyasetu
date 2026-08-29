import { BarChart3 } from "lucide-react"

import { PagePlaceholder } from "@/components/page-placeholder"

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      icon={BarChart3}
      title="Analytics"
      description="Population health & facility performance insights"
      points={[
        "Patient flow trends",
        "Referral outcomes",
        "Disease surveillance",
        "Follow-up adherence",
      ]}
    />
  )
}
