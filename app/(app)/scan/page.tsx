import { QrCode } from "lucide-react"

import { PagePlaceholder } from "@/components/page-placeholder"

export default function ScanPage() {
  return (
    <PagePlaceholder
      icon={QrCode}
      title="Scan Patient"
      description="Scan. Verify. Continue Care."
      points={[
        "Live QR scanner",
        "Swasthya ID verification",
        "Consent & access control",
        "Instant record hand-off",
      ]}
    />
  )
}
