"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import { cn } from "cn"
import { buttonStyles } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

interface Neighbour {
  title: string
  url: string
}

export function Pager({
  previous,
  next,
  className,
}: {
  previous?: Neighbour
  next?: Neighbour
  className?: string
}) {
  return (
    <div className={cn("not-typeset mt-6 flex w-full justify-between gap-3 sm:mt-12", className)}>
      {previous && (
        <div className="group w-40">
          <Link className={buttonStyles({ intent: "plain", isCircle: true })} href={previous.url}>
            <ChevronLeftIcon className="transition-transform group-hover:-translate-x-0.5" />
            <span className="line-clamp-1 text-fg">{previous.title}</span>
          </Link>
        </div>
      )}

      {next && (
        <div className="group ml-auto flex w-40 justify-end">
          <Link className={buttonStyles({ intent: "plain", isCircle: true })} href={next.url}>
            <span className="line-clamp-1 text-fg">{next.title}</span>
            <ChevronRightIcon className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
