import type { Node, Root } from "fumadocs-core/page-tree";
import { source } from "@/lib/source";

export interface NavItem {
  type: "page";
  title: string;
  url: string;
  status?: "new" | "beta";
}

export interface NavSeparator {
  type: "separator";
  title: string;
}

export type NavEntry = NavItem | NavSeparator;

export interface NavGroup {
  title: string;
  items: NavEntry[];
}

const statusByUrl = () => {
  const map = new Map<string, "new" | "beta">();
  for (const page of source.getPages()) {
    if (page.data.status) map.set(page.url, page.data.status);
  }
  return map;
};

function collectEntries(
  nodes: Node[],
  status: Map<string, "new" | "beta">,
): NavEntry[] {
  const entries: NavEntry[] = [];
  for (const node of nodes) {
    if (node.type === "page") {
      entries.push({
        type: "page",
        title: String(node.name),
        url: node.url,
        status: status.get(node.url),
      });
    } else if (node.type === "separator") {
      entries.push({ type: "separator", title: String(node.name) });
    } else if (node.type === "folder") {
      if (node.index) {
        entries.push({
          type: "page",
          title: String(node.index.name),
          url: node.index.url,
          status: status.get(node.index.url),
        });
      }
      entries.push(...collectEntries(node.children, status));
    }
  }
  return entries;
}

export function getNavGroups(tree: Root = source.pageTree): NavGroup[] {
  const status = statusByUrl();
  const groups: NavGroup[] = [];
  for (const node of tree.children) {
    if (node.type === "folder") {
      groups.push({
        title: String(node.name),
        items: collectEntries(node.children, status),
      });
    }
  }
  return groups;
}

export function getFlatNav(tree: Root = source.pageTree): NavItem[] {
  return getNavGroups(tree)
    .flatMap((group) => group.items)
    .filter((item): item is NavItem => item.type === "page");
}

export interface SidebarSection {
  title: string;
  items: NavItem[];
}

/**
 * Sidebar sections like Intent UI's: every section has a mono, uppercase heading and a flat
 * list of links. The first entries of a folder take the folder's title, and each separator
 * in `meta.json` starts a new section.
 */
export function getSidebarSections(
  tree: Root = source.pageTree,
): SidebarSection[] {
  const sections: SidebarSection[] = [];
  for (const group of getNavGroups(tree)) {
    let current: SidebarSection = { title: group.title, items: [] };
    for (const entry of group.items) {
      if (entry.type === "separator") {
        if (current.items.length > 0) sections.push(current);
        current = { title: entry.title, items: [] };
      } else {
        current.items.push(entry);
      }
    }
    if (current.items.length > 0) sections.push(current);
  }
  return sections;
}

export interface SearchItem {
  title: string;
  description: string;
  url: string;
  section: string;
}

/** One entry per page, labelled with the sidebar section it appears in. */
export function getSearchItems(): SearchItem[] {
  const pages = new Map(
    source.getPages().map((page) => [page.url, page.data.description]),
  );
  return getSidebarSections().flatMap((section) =>
    section.items.map((item) => ({
      title: item.title,
      description: pages.get(item.url) ?? "",
      url: item.url,
      section: section.title,
    })),
  );
}

export function getNeighbours(url: string) {
  const flat = getFlatNav();
  const index = flat.findIndex((item) => item.url === url);
  if (index === -1) return { previous: undefined, next: undefined };
  return { previous: flat[index - 1], next: flat[index + 1] };
}
