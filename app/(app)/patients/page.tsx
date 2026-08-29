import { Users } from "lucide-react"

import { PagePlaceholder } from "@/components/page-placeholder"

export default function PatientsPage() {
  return (
    <PagePlaceholder
      icon={Users}
      title="Patients"
      description="Longitudinal records across the care network"
      points={[
        "Searchable patient registry",
        "Full medical timeline",
        "Risk & follow-up flags",
        "New patient registration",
      ]}
    />
  )
}
