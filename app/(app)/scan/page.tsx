import { QrCode } from "lucide-react"

import { ScanExperience } from "@/components/scan/scan-experience"

export default function ScanPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-muted text-teal">
          <QrCode className="size-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Universal Patient QR Scanner
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Scan. Verify. Continue care — with patient consent.
          </p>
        </div>
      </div>

      <ScanExperience />
    </div>
  )
}
