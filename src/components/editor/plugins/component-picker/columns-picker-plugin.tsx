import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { RectangleGroupIcon, StopIcon, ViewColumnsIcon } from "@heroicons/react/16/solid";

import { INSERT_LAYOUT_COMMAND } from "@/components/editor/extensions/layout";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

const COLUMN_ITEMS: {
  value: string;
  label: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
  templateColumns: string;
}[] = [
  {
    value: "columns-one",
    label: "1 column",
    icon: StopIcon,
    templateColumns: "1fr",
  },
  {
    value: "columns-two",
    label: "2 columns",
    icon: ViewColumnsIcon,
    templateColumns: "1fr 1fr",
  },
  {
    value: "columns-three",
    label: "3 columns",
    icon: RectangleGroupIcon,
    templateColumns: "1fr 1fr 1fr",
  },
];

export function ColumnsPickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () =>
      COLUMN_ITEMS.map(({ value, label, icon: Icon, templateColumns }) => ({
        value,
        label: label,
        icon: <Icon className="text-muted-fg" />,
        keywords: ["columns", "layout", "grid"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_LAYOUT_COMMAND, templateColumns);
        },
      })),
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
