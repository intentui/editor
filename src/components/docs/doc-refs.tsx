"use client"

import { BookOpenIcon } from "@heroicons/react/24/outline"
import { BrandIntentuiIcon } from "@/components/icons/brand-intentui-icon"
import { BrandGithubIcon } from "@/components/icons/brand-github-icon"
import { BrandReactAriaIcon } from "@/components/icons/brand-react-aria-icon"
import { LinkButton } from "@/components/link-button"
import { ButtonGroup } from "@/components/ui/button-group"

type Icon = React.FC<React.SVGProps<SVGSVGElement>>

function describe(url: string): { title: string; icon?: Icon } {
  const { hostname } = new URL(url)
  if (hostname.endsWith("intentui.com")) return { title: "Intent UI", icon: BrandIntentuiIcon }
  if (hostname.includes("lexical.dev") || url.includes("lexical")) {
    return { title: "Lexical", icon: BookOpenIcon }
  }
  if (url.includes("react-spectrum") || url.includes("react-aria")) {
    const page = new URL(url).pathname.split("/").filter(Boolean).pop()?.replace(/\.html$/, "")
    return { title: page || "React Aria", icon: BrandReactAriaIcon }
  }
  if (hostname.includes("github")) return { title: "GitHub", icon: BrandGithubIcon }
  if (hostname.includes("shadcn")) return { title: "shadcn" }
  return { title: hostname.replace(/^www\./, "") }
}

export function DocRefs({ references }: { references: string[] }) {
  return (
    <ButtonGroup>
      {references.map((url) => {
        const { title, icon: Icon } = describe(url)
        return (
          <LinkButton
            className="h-10 sm:h-auto dark:bg-secondary/50 dark:hover:bg-secondary"
            key={url}
            target="_blank"
            size="sm"
            intent="outline"
            href={url}
          >
            {Icon && <Icon className={url.includes("react-") ? "size-3!" : ""} data-slot="icon" />}
            {title}
          </LinkButton>
        )
      })}
    </ButtonGroup>
  )
}
