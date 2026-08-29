"use client"

import { BadgeCheck, Download, Printer, ShieldCheck } from "lucide-react"

import { patientProfile } from "@/lib/mock-data"
import { Modal } from "./modal"
import { QrCode } from "./qr-code"
import { useToast } from "./toast"

export function DigitalIdentityModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const p = patientProfile
  const toast = useToast()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Digital Health Identity"
      description="Patient-controlled access credential"
      footer={
        <>
          <button
            onClick={() =>
              toast({
                title: "Preparing identity card",
                description: "Print dialog would open on a connected device.",
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Printer className="size-4" />
            Print Identity Card
          </button>
          <button
            onClick={() =>
              toast({
                title: "QR download started",
                description: "Secure QR saved to your device.",
              })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Download className="size-4" />
            Download QR
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center">
        <div className="w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-teal-muted/60 to-card">
          <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <ShieldCheck className="size-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                SwasthyaSetu
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[11px] font-medium text-success-foreground">
              <BadgeCheck className="size-3" />
              Verified
            </span>
          </div>

          <div className="flex flex-col items-center px-6 py-5">
            <div className="w-44 rounded-xl border border-border bg-card p-3 shadow-sm">
              <QrCode seed={p.swasthyaId + p.name} />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">
              {p.name}
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              {p.swasthyaId}
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-xs text-center text-sm text-muted-foreground text-pretty">
          This QR securely initiates access to the patient&apos;s healthcare
          record.
        </p>
      </div>
    </Modal>
  )
}
