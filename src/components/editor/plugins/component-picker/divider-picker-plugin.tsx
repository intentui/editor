import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { MinusIcon } from "@heroicons/react/16/solid";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

export function DividerPickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "divider",
        label: "Insert divider",
        group: "Basic blocks",
        description: "Visually divide blocks.",
        icon: <MinusIcon className="text-muted-foreground" />,
        keywords: ["horizontal rule", "divider", "hr", "separator"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        },
      },
    ],
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
