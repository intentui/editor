import { CodeBracketIcon } from "@heroicons/react/16/solid";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useMemo } from "react";

import { insertCodeBlock } from "@/components/editor/extensions/code";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

export function CodePickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "code-block",
        label: "Insert code block",
        group: "Advanced",
        description: "Capture a code snippet.",
        icon: <CodeBracketIcon className="text-muted-foreground" />,
        keywords: ["code", "codeblock", "javascript", "python", "js"],
        onSelect: () => insertCodeBlock(editor),
      },
    ],
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
