import { BrandIntentuiIcon } from "@/components/icons/brand-intentui-icon"
import { Link } from "@/components/ui/link"
import { Text } from "@/components/ui/text"
import { app } from "@/config/app"

const footerNavigation = {
  resources: [
    { name: "Introduction", href: "/docs/getting-started/introduction", external: false },
    { name: "Installation", href: "/docs/getting-started/installation", external: false },
    { name: "Patterns", href: "/docs/patterns/full-editor", external: false },
    { name: "Intent UI docs", href: app.site.docs, external: true },
  ],
  intentUi: [
    { name: "Components", href: app.site.components },
    { name: "Blocks", href: app.site.blocks },
    { name: "Showcase", href: app.site.showcase },
    { name: "Themes", href: app.site.themes },
  ],
  design: [
    { name: "Templates", href: `${app.site.design}/templates` },
    { name: "Starter kits", href: `${app.site.design}/starter-kits` },
    { name: "Patterns", href: `${app.site.design}/patterns` },
  ],
  community: [
    { name: "GitHub", href: app.repo.url },
    { name: "Discord", href: app.links.discord },
    { name: "X", href: app.links.twitter },
    { name: "Lexical", href: app.links.lexical },
  ],
}

function Column({
  title,
  items,
}: {
  title: string
  items: { name: string; href: string; external?: boolean }[]
}) {
  return (
    <div>
      <div className="font-medium text-base text-fg">{title}</div>
      <ul className="mt-3 space-y-3 text-sm/6">
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="font-normal text-fg/60 hover:text-fg"
              {...(item.external === false ? {} : { target: "_blank", rel: "noreferrer" })}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-page border-t bg-bg text-fg">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div>
        <div className="border-page py-16 xl:border-l border-b xl:px-20">
          <div className="grid gap-6 grid-cols-2 xl:grid-cols-4">
            <Column title="Resources" items={footerNavigation.resources} />
            <Column title="Intent UI" items={footerNavigation.intentUi} />
            <Column title="Design" items={footerNavigation.design} />
            <Column title="Community" items={footerNavigation.community} />
          </div>
        </div>

        <div className="xl:border-l w-full flex justify-between border-page xl:px-20 py-6">
          <Link href="/" className="flex items-center font-semibold text-fg text-lg">
            <BrandIntentuiIcon className="size-5 shrink-0" />
            <span className="ml-2">
              Intent <span className="text-muted-fg">Editor</span>
            </span>
          </Link>
          <Text>&copy; {`${new Date().getFullYear()} · ${app.name} ™`}</Text>
        </div>
      </div>
    </footer>
  )
}
