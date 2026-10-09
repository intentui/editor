import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { INSERT_CHECK_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { CheckCircleIcon } from "@heroicons/react/16/solid";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

export function CheckListPickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "check-list",
        label: "Check list",
        group: "Basic blocks",
        description: "Track tasks with a to-do list.",
        icon: <CheckCircleIcon className="text-muted-foreground" />,
        keywords: ["check list", "todo list", "checkbox"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        },
      },
    ],
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
