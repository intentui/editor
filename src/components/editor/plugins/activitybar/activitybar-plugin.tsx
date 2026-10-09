import { twMerge } from "cn";

import { ScrollArea } from "@/components/ui/scroll-area";

export function ActivityBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ScrollArea
      data-slot="activitybar"
      orientation="horizontal"
      className={twMerge("w-full shrink-0 border-t border-border", className)}
    >
      <div className="flex h-10 w-max min-w-full items-center justify-between gap-3 px-4 text-xs whitespace-nowrap text-muted-foreground">
        {children}
      </div>
    </ScrollArea>
  );
}
