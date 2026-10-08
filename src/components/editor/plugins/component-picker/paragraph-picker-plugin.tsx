import { useMemo } from "react";

import { $createParagraphNode, $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";

import { Bars3BottomLeftIcon } from "@heroicons/react/16/solid";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

export function ParagraphPickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "paragraph",
        label: "Paragraph",
        icon: <Bars3BottomLeftIcon className="text-muted-fg" />,
        keywords: ["normal", "paragraph", "p", "text"],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection() ?? $getRoot().selectEnd();
            $setBlocksType(selection, () => $createParagraphNode());
          }),
      },
    ],
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
