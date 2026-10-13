"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Snippet,
  SnippetTab,
  SnippetTabPanel,
  SnippetTabPanels,
  SnippetTabsList,
} from "@/components/ui/snippet";

interface CommandItem {
  id: "npm" | "pnpm" | "yarn" | "bun";
  command: string;
}

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

type PackageCommandProps =
  | { exec: string; install?: never; command?: never }
  | { install: string; exec?: never; command?: never }
  | { command: string; exec?: never; install?: never };

const PM_STORAGE_KEY = "preferred-package-manager";
const PM_EVENT = "package-manager-change";

function getStoredPackageManager(): PackageManager {
  if (typeof window === "undefined") return "npm";
  try {
    const v = localStorage.getItem(PM_STORAGE_KEY);
    if (v === "npm" || v === "pnpm" || v === "yarn" || v === "bun") return v;
  } catch {}
  return "npm";
}

function setStoredPackageManager(pm: PackageManager) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PM_STORAGE_KEY, pm);
  } catch {}
  window.dispatchEvent(new CustomEvent(PM_EVENT, { detail: pm }));
}

const INSTALL = /^(npm\s+(?:i|install)|pnpm\s+add|yarn\s+add|bun\s+add)\s+/;
const EXEC = /^(npx|pnpm\s+dlx|yarn\s+dlx|bunx)\s+/;

function parse(props: PackageCommandProps): {
  mode: "install" | "exec";
  args: string;
} {
  if (props.exec)
    return { mode: "exec", args: props.exec.trim().replace(EXEC, "") };
  if (props.install)
    return { mode: "install", args: props.install.trim().replace(INSTALL, "") };

  const cmd = (props.command ?? "").trim().replace(/\s+/g, " ");
  if (INSTALL.test(cmd))
    return { mode: "install", args: cmd.replace(INSTALL, "") };
  if (EXEC.test(cmd)) return { mode: "exec", args: cmd.replace(EXEC, "") };
  if (
    /(^|\/)shadcn(@|$)/.test(cmd) ||
    /\badd\s+@/.test(cmd) ||
    /\binit\b/.test(cmd)
  ) {
    return { mode: "exec", args: cmd };
  }
  return { mode: "install", args: cmd };
}

function buildItems({
  mode,
  args,
}: {
  mode: "install" | "exec";
  args: string;
}): CommandItem[] {
  if (mode === "exec") {
    return [
      { id: "npm", command: `npx ${args}` },
      { id: "pnpm", command: `pnpm dlx ${args}` },
      { id: "yarn", command: `yarn dlx ${args}` },
      { id: "bun", command: `bunx ${args}` },
    ];
  }

  return [
    { id: "npm", command: `npm install ${args}` },
    { id: "pnpm", command: `pnpm add ${args}` },
    { id: "yarn", command: `yarn add ${args}` },
    { id: "bun", command: `bun add ${args}` },
  ];
}

/**
 * Package manager tabs. Use `exec` for one-off CLI commands (`shadcn@latest add ...`) and
 * `install` for dependencies. The chosen manager is remembered across pages.
 */
export function PackageCommand(props: PackageCommandProps) {
  const key = props.exec ?? props.install ?? props.command;
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` is the identity of the props
  const items = useMemo(() => buildItems(parse(props)), [key]);
  const [selectedPM, setSelectedPM] = useState<PackageManager>("npm");

  useEffect(() => {
    setSelectedPM(getStoredPackageManager());

    const handlePMChange = (e: Event) => {
      setSelectedPM((e as CustomEvent<PackageManager>).detail);
    };

    window.addEventListener(PM_EVENT, handlePMChange);
    return () => window.removeEventListener(PM_EVENT, handlePMChange);
  }, []);

  const handleSelectionChange = (key: string | number) => {
    const pm = String(key) as PackageManager;
    setSelectedPM(pm);
    setStoredPackageManager(pm);
  };

  return (
    <Snippet
      className="mt-6 not-typeset"
      selectedKey={selectedPM}
      onSelectionChange={handleSelectionChange}
    >
      <SnippetTabsList
        className="bg-shiki-background"
        items={items}
        aria-label="Package manager"
      >
        {(cmd) => (
          <SnippetTab id={cmd.id} key={cmd.id}>
            {cmd.id}
          </SnippetTab>
        )}
      </SnippetTabsList>
      <SnippetTabPanels items={items}>
        {(cmd) => (
          <SnippetTabPanel className="dark:bg-shiki-background" id={cmd.id}>
            {cmd.command}
          </SnippetTabPanel>
        )}
      </SnippetTabPanels>
    </Snippet>
  );
}
