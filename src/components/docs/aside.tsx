"use client"

import { ArrowUpRightIcon } from "@heroicons/react/20/solid"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import type { LinkProps } from "react-aria-components/Link"
import { Link } from "react-aria-components/Link"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import type { SidebarSection } from "@/lib/docs-nav"

export function Aside({
  sections,
  className,
  onNavigate,
  children,
}: {
  sections: SidebarSection[]
  className?: string
  onNavigate?: () => void
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "sticky h-screen w-full [--gap:--spacing(6)] sm:top-[53px] sm:h-[calc(100dvh-53px)] sm:w-64 sm:[--gap:--spacing(8)]",
        className
      )}
    >
      <div
        data-docs-sidebar-scroll
        className="flex **:data-[slot=section]:px-4 flex-col gap-y-(--gap) h-full py-10 scrollbar-thin scroll-fade-y overflow-y-auto"
      >
        {children && <ul className="px-4 space-y-2 sm:*:text-sm/6">{children}</ul>}
        {sections.map((section) => (
          <div key={section.title}>
            <AsideHeader>{section.title}</AsideHeader>
            <ul data-slot="section">
              {section.items.map((item) => (
                <AsideLink onPress={onNavigate} key={item.url} href={item.url}>
                  {item.title}
                  {item.status && (
                    <Badge
                      className="-mr-2 ml-auto"
                      isCircle={false}
                      intent={item.status === "new" ? "success" : "warning"}
                    >
                      {item.status}
                    </Badge>
                  )}
                </AsideLink>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

interface AsideLinkProps extends LinkProps {
  isActive?: boolean
  href: string
}

export function AsideLink({ href, ...props }: AsideLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  const ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (isActive && ref.current) {
      const scrollContainer = ref.current.closest<HTMLElement>("[data-docs-sidebar-scroll]")
      if (!scrollContainer) return

      const linkRect = ref.current.getBoundingClientRect()
      const containerRect = scrollContainer.getBoundingClientRect()
      const visibleTop = Math.max(containerRect.top, 0)
      const visibleBottom = Math.min(containerRect.bottom, window.innerHeight)
      const edgePadding = 32
      const isWithinVisibleArea =
        linkRect.top >= visibleTop + edgePadding && linkRect.bottom <= visibleBottom - edgePadding

      if (isWithinVisibleArea) return

      scrollContainer.scrollTo({
        top:
          scrollContainer.scrollTop +
          (linkRect.top + linkRect.bottom) / 2 -
          (visibleTop + visibleBottom) / 2,
        behavior: "instant",
      })
    }
  }, [isActive])

  return (
    <li className="relative">
      {isActive && (
        <span
          aria-hidden
          className="absolute top-1/2 -left-4 hidden h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary md:block dark:bg-primary-subtle-fg"
        />
      )}
      <Link
        {...props}
        href={href}
        ref={ref}
        className={cn(
          "group relative mb-0.5 flex items-center gap-x-2 rounded-lg px-2 py-1 text-base text-fg/70 sm:text-sm/6",
          "hover:text-fg focus:text-fg focus:outline-hidden",
          "*:[svg]:size-4.5 *:[svg]:text-muted-fg hover:*:[svg]:text-fg",
          isActive && "font-medium text-fg"
        )}
      >
        <>
          {props.children as React.ReactNode}

          {props.target === "_blank" && (
            <ArrowUpRightIcon
              style={{
                width: "16px",
                height: "16px",
              }}
              className="-mr-1 ml-auto block text-muted-fg lg:hidden lg:group-hover:block"
            />
          )}
        </>
      </Link>
    </li>
  )
}

function AsideHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative mb-2 block px-6 font-mono text-[11px] text-muted-fg uppercase",
        className
      )}
      {...props}
    />
  )
}
