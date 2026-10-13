import { Fragment } from "react";

import { type ElementFormatType, FORMAT_ELEMENT_COMMAND } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import {
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  Bars4Icon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/16/solid";

import { useFormatStateValue } from "@/components/editor/extensions/format-state-extension";
import { ToolbarGroup, ToolbarItem, ToolbarSeparator } from "@/components/ui/toolbar";
import { TooltipTrigger, Tooltip } from "@/components/ui/tooltip";

type AlignItem = {
  value: Exclude<ElementFormatType, "">;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function AlignToggleGroup({ items }: { items: AlignItem[] }) {
  const [editor] = useLexicalComposerContext();
  const elementFormat = useFormatStateValue("elementFormat");
  const isEditable = useLexicalEditable();
  return (
    <ToolbarGroup aria-label="Alignment" isDisabled={!isEditable}>
      {items.map(({ value, label, icon: Icon }) => (
        <TooltipTrigger key={value}>
          <ToolbarItem
            size="sq-xs"
            aria-label={label}
            isSelected={elementFormat === value}
            onChange={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value)}
          >
            <Icon />
          </ToolbarItem>
          <Tooltip>{label}</Tooltip>
        </TooltipTrigger>
      ))}
    </ToolbarGroup>
  );
}

export function ElementFormatToolbarPlugin({ formats = "all" }: { formats?: "basic" | "all" }) {
  const alignGroups: AlignItem[][] = [
    [
      { value: "left", icon: Bars3BottomLeftIcon, label: "Align left" },
      { value: "center", icon: Bars3Icon, label: "Align center" },
      { value: "right", icon: Bars3BottomRightIcon, label: "Align right" },
      { value: "justify", icon: Bars4Icon, label: "Justify" },
    ],
    [
      {
        value: "start",
        icon: ChevronDoubleLeftIcon,
        label: "Align start",
      },
      {
        value: "end",
        icon: ChevronDoubleRightIcon,
        label: "Align end",
      },
    ],
  ];

  const groups = formats === "basic" ? alignGroups.slice(0, 1) : alignGroups;

  return (
    <>
      {groups.map((items, groupIndex) => (
        <Fragment key={groupIndex}>
          {groupIndex > 0 && <ToolbarSeparator />}
          <AlignToggleGroup items={items} />
        </Fragment>
      ))}
    </>
  );
}
