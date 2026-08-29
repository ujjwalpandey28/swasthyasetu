import { Send } from "lucide-react"

import { PagePlaceholder } from "@/components/page-placeholder"

export default function ReferralsPage() {
  return (
    <PagePlaceholder
      icon={Send}
      title="Referrals"
      description="Transfer patients across the care network with context"
      points={[
        "Emergency / urgent / routine",
        "Facility routing & capacity",
        "Shared clinical context",
        "Live transfer tracking",
      ]}
    />
  )
}
