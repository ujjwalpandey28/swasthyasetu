import { Building2 } from "lucide-react"

import { PagePlaceholder } from "@/components/page-placeholder"

export default function FacilityPage() {
  return (
    <PagePlaceholder
      icon={Building2}
      title="Facility"
      description="Dhanwantri Nagar Primary Health Centre"
      points={[
        "Staff & worker verification",
        "Bed & resource capacity",
        "Service catalogue",
        "Facility network map",
      ]}
    />
  )
}
