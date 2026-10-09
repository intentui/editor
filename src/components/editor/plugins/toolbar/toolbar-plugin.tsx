"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

import { cn } from "cn";

import { cx } from "@/lib/primitive";

import { Button } from "@/components/ui/button";
import { Toolbar as ToolbarPrimitive, type ToolbarProps } from "@/components/ui/toolbar";

const SCROLL_STEP = 0.75;

export function Toolbar({ className, ...props }: ToolbarProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const getScroller = () => wrapperRef.current?.querySelector<HTMLElement>("[role=toolbar]") ?? null;
  const [overflow, setOverflow] = useState({ start: false, end: false });

  const update = useCallback(() => {
    const el = wrapperRef.current?.querySelector<HTMLElement>("[role=toolbar]");
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const offset = Math.abs(el.scrollLeft);
    setOverflow({ start: offset > 1, end: offset < max - 1 });
  }, []);

  useEffect(() => {
    const el = wrapperRef.current?.querySelector<HTMLElement>("[role=toolbar]");
    if (!el) return;

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    el.addEventListener("scroll", update, { passive: true });

    // Let a vertical mouse wheel scroll the toolbar sideways while it can still move.
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      const atStart = event.deltaY < 0 && el.scrollLeft <= 0;
      const atEnd = event.deltaY > 0 && Math.abs(el.scrollLeft) >= max - 1;
      if (max <= 0 || atStart || atEnd) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
      el.removeEventListener("wheel", onWheel);
    };
  }, [update]);

  const scroll = (direction: -1 | 1) => {
    const el = getScroller();
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    el.scrollBy({
      left: direction * rtl * el.clientWidth * SCROLL_STEP,
      behavior: "smooth",
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full shrink-0">
      <ToolbarPrimitive
        aria-label="Formatting"
        {...props}
        className={cx(
          "w-full flex-nowrap gap-1 overflow-x-auto overscroll-x-contain scroll-px-14 rounded-none border-b border-border bg-bg p-1.5 inset-ring-0 *:shrink-0",
          className,
        )}
      />
      <ScrollEdge side="start" visible={overflow.start} onPress={() => scroll(-1)} />
      <ScrollEdge side="end" visible={overflow.end} onPress={() => scroll(1)} />
    </div>
  );
}

function ScrollEdge({
  side,
  visible,
  onPress,
}: {
  side: "start" | "end";
  visible: boolean;
  onPress: () => void;
}) {
  const isStart = side === "start";
  const Icon = isStart ? ChevronLeftIcon : ChevronRightIcon;
  return (
    // The padding matches the toolbar's p-1.5, so the button sits exactly where a control
    // would. The fade only softens the controls that scroll underneath it.
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-0 bottom-px z-10 flex w-14 items-center from-bg via-bg via-72% to-transparent transition-opacity duration-150",
        isStart
          ? "inset-s-0 justify-start ps-1.5 bg-linear-to-r rtl:bg-linear-to-l"
          : "inset-e-0 justify-end pe-1.5 bg-linear-to-l rtl:bg-linear-to-r",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <Button
        intent="outline"
        size="sq-xs"
        excludeFromTabOrder
        isDisabled={!visible}
        aria-label={isStart ? "Scroll toolbar left" : "Scroll toolbar right"}
        onPress={onPress}
        className={cn("[--btn-bg:var(--color-bg)]", visible && "pointer-events-auto")}
      >
        <Icon className="rtl:rotate-180" />
      </Button>
    </div>
  );
}
