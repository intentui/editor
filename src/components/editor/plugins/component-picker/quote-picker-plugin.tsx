import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/16/solid";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

export function QuotePickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "quote",
        label: "Quote",
        group: "Basic blocks",
        description: "Capture a quote.",
        icon: <ChatBubbleBottomCenterTextIcon className="text-muted-foreground" />,
        keywords: ["quote", "block quote", "blockquote"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection() ?? $getRoot().selectEnd();
            $setBlocksType(selection, () => $createQuoteNode());
          }),
      },
    ],
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
