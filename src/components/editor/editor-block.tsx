"use client";

import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import {
  HorizontalRuleExtension,
  TabIndentationExtension,
} from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { CheckListExtension, ListExtension } from "@lexical/list";
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  registerMarkdownShortcuts,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type Transformer,
} from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";
import { defineExtension } from "lexical";
import { useMemo } from "react";

import { AutoLinkExtension } from "@/components/editor/extensions/auto-link-extension";
import { CodeExtension } from "@/components/editor/extensions/code-extension";
import { DragDropPasteExtension } from "@/components/editor/extensions/drag-drop-paste-extension";
import { FormatStateExtension } from "@/components/editor/extensions/format-state-extension";
import { ImageExtension } from "@/components/editor/extensions/image-extension";
import { LayoutExtension } from "@/components/editor/extensions/layout-extension";
import { LinkExtension } from "@/components/editor/extensions/link-extension";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts-extension";
import { BulletedListPickerPlugin } from "@/components/editor/plugins/component-picker/bulleted-list-picker-plugin";
import { CheckListPickerPlugin } from "@/components/editor/plugins/component-picker/check-list-picker-plugin";
import { CodePickerPlugin } from "@/components/editor/plugins/component-picker/code-picker-plugin";
import { ColumnsPickerPlugin } from "@/components/editor/plugins/component-picker/columns-picker-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { DividerPickerPlugin } from "@/components/editor/plugins/component-picker/divider-picker-plugin";
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin";
import { ImagePickerPlugin } from "@/components/editor/plugins/component-picker/image-picker-plugin";
import { NumberedListPickerPlugin } from "@/components/editor/plugins/component-picker/numbered-list-picker-plugin";
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin";
import { QuotePickerPlugin } from "@/components/editor/plugins/component-picker/quote-picker-plugin";
import { TablePickerPlugin } from "@/components/editor/plugins/component-picker/table-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin";
import { FloatingToolbarPlugin } from "@/components/editor/plugins/floating/floating-toolbar-plugin";
import { LinkEditorPlugin } from "@/components/editor/plugins/floating/link-editor-plugin";
import { TableHoverActionsPlugin } from "@/components/editor/plugins/floating/table-hover-actions-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { HR } from "@/components/editor/transformers/horizontal-rule-transformer";
import { IMAGE } from "@/components/editor/transformers/image-transformer";
import { TABLE } from "@/components/editor/transformers/table-transformer";
import { ToolbarSeparator } from "@/components/ui/toolbar";

const BLOCK_TRANSFORMERS: Transformer[] = [
  TABLE,
  HR,
  IMAGE,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

export function DemoBlockEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/block",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          TabIndentationExtension,
          ListExtension,
          CheckListExtension,
          LinkExtension,
          AutoLinkExtension,
          CodeExtension,
          LayoutExtension,
          TableExtension,
          HorizontalRuleExtension,
          ImageExtension,
          DragDropPasteExtension,
          ShortcutsExtension,
          FormatStateExtension,
          ClipboardDOMImportExtension,
        ],
        register: (editor) =>
          registerMarkdownShortcuts(editor, BLOCK_TRANSFORMERS),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="relative flex min-h-80 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable
            variant="draggable"
            placeholder="Type '/' for commands"
            className="flex-1"
          />
          <DraggableBlockPlugin />
          <FloatingToolbarPlugin>
            <TextFormatToolbarPlugin formats="basic" />
            <ToolbarSeparator />
            <LinkToolbarPlugin />
          </FloatingToolbarPlugin>
          <LinkEditorPlugin />
          <TableHoverActionsPlugin />
          <ComponentPicker variant="detailed">
            <ParagraphPickerPlugin />
            <HeadingPickerPlugin />
            <BulletedListPickerPlugin />
            <NumberedListPickerPlugin />
            <CheckListPickerPlugin />
            <QuotePickerPlugin />
            <DividerPickerPlugin />
            <ImagePickerPlugin />
            <TablePickerPlugin />
            <CodePickerPlugin />
            <ColumnsPickerPlugin />
          </ComponentPicker>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
