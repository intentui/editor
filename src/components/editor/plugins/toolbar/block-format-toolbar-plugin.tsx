import {
  Bars3BottomLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ListBulletIcon,
  NumberedListIcon,
} from "@heroicons/react/16/solid";
import { getPeerDependencyFromEditor } from "@lexical/extension";
import {
  $isListNode,
  type CheckListExtension,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  type ListExtension,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  type ElementNode,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useEffect, useMemo, useState } from "react";

import { $getSelectedNode } from "@/components/editor/extensions/format-state";
import {
  ComboBox,
  ComboBoxContent,
  ComboBoxInput,
  ComboBoxItem,
  ComboBoxLabel,
} from "@/components/ui/combo-box";

const BLOCK_TYPES = [
  "paragraph",
  "h1",
  "h2",
  "h3",
  "number",
  "bullet",
  "check",
  "quote",
] as const;

type BlockType = (typeof BLOCK_TYPES)[number];

const BLOCK_ITEMS: Record<
  BlockType,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  paragraph: { label: "Paragraph", icon: Bars3BottomLeftIcon },
  h1: { label: "Heading 1", icon: H1Icon },
  h2: { label: "Heading 2", icon: H2Icon },
  h3: { label: "Heading 3", icon: H3Icon },
  number: { label: "Numbered list", icon: NumberedListIcon },
  bullet: { label: "Bulleted list", icon: ListBulletIcon },
  check: { label: "Check list", icon: CheckCircleIcon },
  quote: { label: "Quote", icon: ChatBubbleBottomCenterTextIcon },
};

function $getBlockType(): BlockType | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return null;
  }
  const node = $getSelectedNode(selection);
  const list = $findMatchingParent(node, $isListNode);
  if (list) {
    return list.getListType();
  }
  const element = $findMatchingParent(
    node,
    (parent): parent is ElementNode =>
      $isElementNode(parent) && !parent.isInline(),
  );
  if ($isHeadingNode(element)) {
    const tag = element.getTag();
    return (BLOCK_TYPES as readonly string[]).includes(tag)
      ? (tag as BlockType)
      : "paragraph";
  }
  return $isQuoteNode(element) ? "quote" : "paragraph";
}

function $createBlockNode(blockType: BlockType) {
  switch (blockType) {
    case "h1":
    case "h2":
    case "h3":
      return $createHeadingNode(blockType);
    case "quote":
      return $createQuoteNode();
    default:
      return $createParagraphNode();
  }
}

function useBlockType(): BlockType {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>(
    () => editor.getEditorState().read($getBlockType) ?? "paragraph",
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        const next = editorState.read($getBlockType);
        if (next) {
          setBlockType(next);
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          const next = $getBlockType();
          if (next) {
            setBlockType(next);
          }
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor]);

  return blockType;
}

export function BlockFormatToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const blockType = useBlockType();
  const isEditable = useLexicalEditable();

  const items = useMemo(() => {
    const hasList =
      getPeerDependencyFromEditor<typeof ListExtension>(
        editor,
        "@lexical/list/List",
      ) !== undefined;
    const hasCheckList =
      getPeerDependencyFromEditor<typeof CheckListExtension>(
        editor,
        "@lexical/list/CheckList",
      ) !== undefined;
    return BLOCK_TYPES.filter((item) => {
      if (item === "number" || item === "bullet") {
        return hasList;
      }
      if (item === "check") {
        return hasCheckList;
      }
      return true;
    });
  }, [editor]);

  const comboItems = useMemo(() => items.map((id) => ({ id })), [items]);

  return (
    <ComboBox
      aria-label="Block type"
      className="w-48"
      defaultItems={comboItems}
      value={blockType}
      isDisabled={!isEditable}
      onChange={(key) => {
        if (key === null) {
          return;
        }
        const value = key as BlockType;
        editor.update(() => {
          if (!$getSelection()) {
            $getRoot().selectEnd();
          }
        });
        switch (value) {
          case "number":
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            return;
          case "bullet":
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            return;
          case "check":
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
            return;
        }
        editor.update(() => {
          const selection = $getSelection() ?? $getRoot().selectEnd();
          $setBlocksType(selection, () => $createBlockNode(value));
        });
      }}
    >
      <ComboBoxInput className="h-7 py-0 sm:py-0 sm:text-xs" />
      <ComboBoxContent
        renderEmptyState={() => (
          <span className="block p-2 text-sm text-muted-foreground">
            No matches
          </span>
        )}
      >
        {(item: { id: BlockType }) => {
          const { label, icon: Icon } = BLOCK_ITEMS[item.id];
          return (
            <ComboBoxItem id={item.id} textValue={label}>
              <Icon />
              <ComboBoxLabel>{label}</ComboBoxLabel>
            </ComboBoxItem>
          );
        }}
      </ComboBoxContent>
    </ComboBox>
  );
}
