import { Navigation } from "@/components/navigation";
import { getSearchItems, getSidebarSections } from "@/lib/docs-nav";

export function SiteHeader() {
  return (
    <Navigation
      sections={getSidebarSections()}
      searchItems={getSearchItems()}
    />
  );
}
