"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogoLink } from "@/components/brand-logo-link";
import { CommandPalette } from "@/components/command-palette";
import { GithubLink } from "@/components/github-link";
import { BrandDiscordIcon } from "@/components/icons/brand-discord-icon";
import { BrandXIcon } from "@/components/icons/brand-x-icon";
import { NavLink } from "@/components/nav-item";
import { PageContainer } from "@/components/page-container";
import { ResponsiveNavigation } from "@/components/responsive-navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button, buttonStyles } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { app } from "@/config/app";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { SearchItem, SidebarSection } from "@/lib/docs-nav";

export function Navigation({
  sections,
  searchItems,
}: {
  sections: SidebarSection[];
  searchItems: SearchItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return (
    <>
      <CommandPalette setOpen={setOpen} openCmd={open} items={searchItems} />
      <div className="xnw2 sticky top-0 z-40 hidden overflow-hidden bg-background/70 border-page border-b backdrop-blur-3xl lg:block">
        <PageContainer>
          <div className="relative flex items-center justify-between border-page border-x pl-5 pr-3 py-2">
            <div className="flex items-center gap-x-1.5">
              <div className="mx-auto flex items-center">
                <BrandLogoLink />
              </div>
              <NavLink
                isNextLink
                isActive={
                  pathname?.startsWith("/docs") &&
                  !pathname?.startsWith("/docs/patterns")
                }
                href="/docs/getting-started/introduction"
              >
                Docs
              </NavLink>
              <NavLink
                isNextLink
                isActive={pathname?.startsWith("/docs/patterns")}
                href="/docs/patterns/full-editor"
              >
                Patterns
              </NavLink>
              <NavLink target="_blank" href={app.site.components}>
                Components
              </NavLink>
              <NavLink target="_blank" href={app.site.blocks}>
                Blocks
              </NavLink>
              <NavLink target="_blank" href={app.site.themes}>
                Themes
              </NavLink>
              <NavLink target="_blank" href={app.site.showcase}>
                Showcase
              </NavLink>
            </div>
            <div className="flex items-center gap-x-1.5">
              <Button
                aria-label="Search"
                isCircle
                onPress={() => setOpen((open: boolean) => !open)}
                size="sq-sm"
                intent="plain"
              >
                <MagnifyingGlassIcon />
              </Button>

              <Link
                aria-label="Join Discord"
                className={buttonStyles({
                  intent: "plain",
                  size: "sq-sm",
                  isCircle: true,
                })}
                target="_blank"
                href={app.links.discord}
              >
                <BrandDiscordIcon />
              </Link>
              <Link
                aria-label="Follow Update on X"
                className={buttonStyles({
                  intent: "plain",
                  size: "sq-sm",
                  isCircle: true,
                  className: "**:data-[slot=icon]:text-foreground",
                })}
                target="_blank"
                href={app.links.twitter}
              >
                <BrandXIcon />
              </Link>

              <GithubLink />
              <ThemeSwitcher intent="plain" isCircle />
            </div>
          </div>
        </PageContainer>
      </div>
      {!isDesktop && <ResponsiveNavigation sections={sections} />}
    </>
  );
}
