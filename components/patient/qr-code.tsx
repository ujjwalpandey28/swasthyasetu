"use client"

// A stylized, deterministic QR-style glyph generated from a seed string.
// Purely decorative — represents a secure identity token, not real data.
export function QrCode({
  seed,
  className = "",
}: {
  seed: string
  className?: string
}) {
  const size = 21
  const cells: boolean[] = []
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  for (let i = 0; i < size * size; i++) {
    // xorshift-ish deterministic sequence
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    cells.push((h & 7) > 3)
  }

  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7
    return inBox(0, 0) || inBox(0, size - 7) || inBox(size - 7, 0)
  }

  return (
    <div
      className={`relative grid aspect-square w-full gap-px ${className}`}
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      aria-hidden="true"
    >
      {cells.map((on, i) => {
        const r = Math.floor(i / size)
        const c = i % size
        if (isFinder(r, c)) return <span key={i} />
        return (
          <span
            key={i}
            className={on ? "bg-navy" : "bg-transparent"}
            style={{ borderRadius: 1 }}
          />
        )
      })}
      {/* Finder patterns */}
      <Finder className="left-0 top-0" />
      <Finder className="right-0 top-0" />
      <Finder className="bottom-0 left-0" />
    </div>
  )
}

function Finder({ className }: { className: string }) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ width: "33.33%", height: "33.33%" }}
    >
      <div className="flex h-full w-full items-center justify-center rounded-[18%] bg-navy p-[14%]">
        <div className="flex h-full w-full items-center justify-center rounded-[16%] bg-card p-[22%]">
          <div className="h-full w-full rounded-[14%] bg-navy" />
        </div>
      </div>
    </div>
  )
}
