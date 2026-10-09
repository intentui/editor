"use client"

import Link from "next/link"
import { buttonStyles } from "@/components/ui/button"

export function HeroActions() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/docs/getting-started/introduction"
        className={buttonStyles({ intent: "primary", size: "lg" })}
      >
        Get started
      </Link>
      <Link
        href="/docs/getting-started/installation"
        className={buttonStyles({ intent: "outline", size: "lg" })}
      >
        Installation
      </Link>
    </div>
  )
}
