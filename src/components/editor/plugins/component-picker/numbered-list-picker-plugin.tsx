import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { NumberedListIcon } from "@heroicons/react/16/solid";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

export function NumberedListPickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "numbered-list",
        label: "Numbered list",
        icon: <NumberedListIcon className="text-muted-fg" />,
        keywords: ["numbered list", "ordered list", "ol"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        },
      },
    ],
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
