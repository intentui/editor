import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

import { H1Icon, H2Icon, H3Icon } from "@heroicons/react/16/solid";

import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/editor/plugins/component-picker/component-picker-plugin";

const HEADINGS: {
  tag: HeadingTagType;
  label: string;
  description: string;
  icon: React.ComponentType<React.ComponentProps<"svg">>;
}[] = [
  { tag: "h1", label: "Heading 1", description: "Big section heading.", icon: H1Icon },
  { tag: "h2", label: "Heading 2", description: "Medium section heading.", icon: H2Icon },
  { tag: "h3", label: "Heading 3", description: "Small section heading.", icon: H3Icon },
];

export function HeadingPickerPlugin() {
  const [editor] = useLexicalComposerContext();

  const items = useMemo<ComponentPickerItem[]>(
    () =>
      HEADINGS.map(({ tag, label, description, icon: Icon }) => ({
        value: tag,
        label: label,
        group: "Basic blocks",
        description,
        icon: <Icon className="text-muted-fg" />,
        keywords: ["heading", "header", tag],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection() ?? $getRoot().selectEnd();
            $setBlocksType(selection, () => $createHeadingNode(tag));
          }),
      })),
    [editor],
  );

  useComponentPickerItems(items);

  return null;
}
