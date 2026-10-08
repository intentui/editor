import { cx } from "@/lib/primitive";

import { Toolbar as ToolbarPrimitive, type ToolbarProps } from "@/components/ui/toolbar";

export function Toolbar({ className, ...props }: ToolbarProps) {
  return (
    <ToolbarPrimitive
      aria-label="Formatting"
      {...props}
      className={cx(
        "w-full shrink-0 flex-wrap gap-1 rounded-none border-b border-border bg-bg p-1.5 inset-ring-0",
        className,
      )}
    />
  );
}
