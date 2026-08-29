"use client"

import { QrCode, ScanLine } from "lucide-react"

import { cn } from "@/lib/utils"

type ScannerState = "idle" | "scanning" | "found"

interface ScannerFrameProps {
  state: ScannerState
}

export function ScannerFrame({ state }: ScannerFrameProps) {
  const isScanning = state === "scanning"
  const isFound = state === "found"

  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl border transition-colors duration-500",
        isFound
          ? "border-success/40 bg-success-muted/40"
          : "border-primary/25 bg-[#0b1f2a]",
      )}
    >
      {/* Camera-style dark viewfinder gradient */}
      {!isFound && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 40%, rgba(45,212,191,0.14), transparent 55%), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 22px)",
          }}
          aria-hidden
        />
      )}

      {/* Corner brackets */}
      {!isFound && (
        <>
          <Corner className="left-6 top-6 border-l-2 border-t-2" />
          <Corner className="right-6 top-6 border-r-2 border-t-2" />
          <Corner className="bottom-6 left-6 border-b-2 border-l-2" />
          <Corner className="bottom-6 right-6 border-b-2 border-r-2" />
        </>
      )}

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        {isFound ? (
          <span className="flex size-16 items-center justify-center rounded-2xl bg-success text-success-foreground">
            <ScanLine className="size-7" />
          </span>
        ) : (
          <span
            className={cn(
              "flex size-20 items-center justify-center rounded-2xl border border-primary/40 text-primary-foreground/80",
              isScanning ? "animate-reticle-pulse" : "opacity-70",
            )}
          >
            <QrCode className="size-10 text-teal" />
          </span>
        )}

        {!isFound && (
          <p className="text-sm font-medium text-white/70">
            {isScanning ? "Scanning QR…" : "Position the QR inside the frame"}
          </p>
        )}
      </div>

      {/* Animated sweep line */}
      {isScanning && (
        <div className="absolute inset-x-8 top-8 bottom-8 overflow-hidden">
          <div className="animate-scan-sweep absolute inset-x-0 top-0 h-16 -translate-y-full bg-gradient-to-b from-transparent via-teal/40 to-teal">
            <div className="absolute bottom-0 h-0.5 w-full bg-teal shadow-[0_0_12px_2px_var(--teal)]" />
          </div>
        </div>
      )}
    </div>
  )
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "absolute size-9 rounded-md border-teal/80",
        className,
      )}
      aria-hidden
    />
  )
}
