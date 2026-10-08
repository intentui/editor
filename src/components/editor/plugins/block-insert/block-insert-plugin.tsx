import { ToolbarGroup } from "@/components/ui/toolbar";

export function BlockInsert(props: React.ComponentProps<typeof ToolbarGroup>) {
  return <ToolbarGroup aria-label="Insert" {...props} />;
}
