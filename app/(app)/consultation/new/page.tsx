import { Stethoscope } from "lucide-react"

import { PagePlaceholder } from "@/components/page-placeholder"

export default function NewConsultationPage() {
  return (
    <PagePlaceholder
      icon={Stethoscope}
      title="New Consultation"
      description="Record a visit on the patient's continuous journey"
      points={[
        "Vitals & symptoms",
        "Diagnosis & prescription",
        "Lab & investigation orders",
        "Add to health timeline",
      ]}
    />
  )
}
