import { Bars3BottomLeftIcon } from "@heroicons/react/16/solid";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getRoot, $getSelection } from "lexical";
import { useMemo } from "react";

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
        group: "Basic blocks",
        description: "Just start writing with plain text.",
        icon: <Bars3BottomLeftIcon className="text-muted-foreground" />,
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
