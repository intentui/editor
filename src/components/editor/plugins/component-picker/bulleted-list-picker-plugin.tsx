import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { ListBulletIcon } from "@heroicons/react/16/solid";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

export function BulletedListPickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "bulleted-list",
        label: "Bulleted list",
        group: "Basic blocks",
        description: "Create a simple bulleted list.",
        icon: <ListBulletIcon className="text-muted-fg" />,
        keywords: ["bulleted list", "unordered list", "ul"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        },
      },
    ],
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
