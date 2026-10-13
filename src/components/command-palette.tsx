"use client";

import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  CubeIcon,
  HashtagIcon,
  HomeIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  SwatchIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  CommandMenu,
  CommandMenuFooter,
  CommandMenuItem,
  CommandMenuLabel,
  CommandMenuList,
  CommandMenuSearch,
  CommandMenuSection,
  CommandMenuSeparator,
} from "@/components/ui/command-menu";
import { app } from "@/config/app";
import type { SearchItem } from "@/lib/docs-nav";

export interface OpenCloseProps {
  openCmd: boolean;
  setOpen?: (isOpen: boolean) => void;
  items: SearchItem[];
}

export function CommandPalette({ openCmd, setOpen, items }: OpenCloseProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [debouncedInput] = useDebounce(input, 300);
  const inputLower = debouncedInput.trim().toLowerCase();
  const isLoading = input.length >= 2 && input !== debouncedInput;

  const results = useMemo(() => {
    if (!inputLower) return [];
    const sections = new Map<string, SearchItem[]>();
    for (const item of items) {
      const matches =
        item.title.toLowerCase().includes(inputLower) ||
        item.section.toLowerCase().includes(inputLower) ||
        item.description.toLowerCase().includes(inputLower) ||
        item.url.toLowerCase().includes(inputLower);
      if (!matches) continue;
      sections.set(item.section, [...(sections.get(item.section) ?? []), item]);
    }
    return [...sections.entries()].map(([section, children]) => ({
      section,
      children,
    }));
  }, [inputLower, items]);

  return (
    <CommandMenu
      shortcut="k"
      isOpen={openCmd}
      onOpenChange={setOpen}
      inputValue={input}
      onInputChange={setInput}
      isPending={isLoading}
    >
      <CommandMenuSearch placeholder="Search docs and patterns..." />
      <CommandMenuList>
        <CommandMenuSection aria-label="Pages">
          <CommandMenuItem textValue="Home" href="/">
            <HomeIcon />
            <CommandMenuLabel>Home</CommandMenuLabel>
          </CommandMenuItem>
          <CommandMenuItem
            textValue="Docs"
            href="/docs/getting-started/introduction"
          >
            <BookOpenIcon />
            <CommandMenuLabel>Docs</CommandMenuLabel>
          </CommandMenuItem>
          <CommandMenuItem
            textValue="Patterns"
            href="/docs/patterns/full-editor"
          >
            <Square3Stack3DIcon />
            <CommandMenuLabel>Patterns</CommandMenuLabel>
          </CommandMenuItem>
          <CommandMenuSeparator className="my-1.5" />
          <CommandMenuItem
            textValue="components"
            href={app.site.components}
            target="_blank"
          >
            <CubeIcon />
            <CommandMenuLabel>Components</CommandMenuLabel>
            <ArrowTopRightOnSquareIcon />
          </CommandMenuItem>
          <CommandMenuItem
            textValue="blocks"
            href={app.site.blocks}
            target="_blank"
          >
            <WindowIcon />
            <CommandMenuLabel>Blocks</CommandMenuLabel>
            <ArrowTopRightOnSquareIcon />
          </CommandMenuItem>
          <CommandMenuItem
            textValue="themes"
            href={app.site.themes}
            target="_blank"
          >
            <SwatchIcon />
            <CommandMenuLabel>Themes</CommandMenuLabel>
            <ArrowTopRightOnSquareIcon />
          </CommandMenuItem>
          <CommandMenuItem
            textValue="showcase"
            href={app.site.showcase}
            target="_blank"
          >
            <Squares2X2Icon />
            <CommandMenuLabel>Showcase</CommandMenuLabel>
            <ArrowTopRightOnSquareIcon />
          </CommandMenuItem>
        </CommandMenuSection>

        {results.map((result) => (
          <CommandMenuSection
            key={result.section}
            label={result.section}
            items={result.children}
          >
            {(item: SearchItem) => (
              <CommandMenuItem
                key={item.url}
                id={item.url}
                textValue={`${item.section} ${item.title} ${item.description}`}
                onAction={() => {
                  router.push(item.url, { scroll: false });
                  setOpen?.(false);
                }}
              >
                <HashtagIcon />
                <CommandMenuLabel>{item.title}</CommandMenuLabel>
              </CommandMenuItem>
            )}
          </CommandMenuSection>
        ))}
      </CommandMenuList>
      <CommandMenuFooter className="text-xs">
        Use <kbd>↑</kbd> and <kbd>↓</kbd> to navigate, <kbd>↵</kbd> to select.
      </CommandMenuFooter>
    </CommandMenu>
  );
}
