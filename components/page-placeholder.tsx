import type { LucideIcon } from "lucide-react"
import { Sparkles } from "lucide-react"

interface PagePlaceholderProps {
  icon: LucideIcon
  title: string
  description: string
  points?: string[]
}

export function PagePlaceholder({
  icon: Icon,
  title,
  description,
  points = [],
}: PagePlaceholderProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-muted text-teal">
          <Icon className="size-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Sparkles className="size-5.5" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Coming up next
        </h2>
        <p className="mt-1 max-w-md text-sm text-muted-foreground text-pretty">
          This screen is scaffolded and wired into navigation. The full
          workflow will be built in an upcoming step.
        </p>

        {points.length > 0 && (
          <ul className="mt-6 grid w-full max-w-lg grid-cols-1 gap-2 text-left sm:grid-cols-2">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
