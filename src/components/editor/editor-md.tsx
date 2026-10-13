"use client";

import { useMemo } from "react";

import {
  COMMAND_PRIORITY_HIGH,
  FORMAT_TEXT_COMMAND,
  defineExtension,
  mergeRegister,
  type TextFormatType,
} from "lexical";

import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import {
  ClearEditorExtension,
  HorizontalRuleExtension,
  TabIndentationExtension,
} from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { CheckListExtension, ListExtension } from "@lexical/list";
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type Transformer,
  registerMarkdownShortcuts,
} from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";

import { AutoLinkExtension } from "@/components/editor/extensions/auto-link";
import { CodeExtension } from "@/components/editor/extensions/code";
import { DragDropPasteExtension } from "@/components/editor/extensions/drag-drop-paste";
import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ImageExtension } from "@/components/editor/extensions/image";
import { LinkExtension } from "@/components/editor/extensions/link";
import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { CountPlugin } from "@/components/editor/plugins/activitybar/count-plugin";
import { ReadOnlyTogglePlugin } from "@/components/editor/plugins/activitybar/read-only-toggle-plugin";
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertCodeBlockPlugin } from "@/components/editor/plugins/block-insert/insert-code-block-plugin";
import { InsertHorizontalRulePlugin } from "@/components/editor/plugins/block-insert/insert-horizontal-rule-plugin";
import { InsertImagePlugin } from "@/components/editor/plugins/block-insert/insert-image-plugin";
import { InsertTablePlugin } from "@/components/editor/plugins/block-insert/insert-table-plugin";
import { BulletedListPickerPlugin } from "@/components/editor/plugins/component-picker/bulleted-list-picker-plugin";
import { CheckListPickerPlugin } from "@/components/editor/plugins/component-picker/check-list-picker-plugin";
import { CodePickerPlugin } from "@/components/editor/plugins/component-picker/code-picker-plugin";
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
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { ClearToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { ImportExportToolbarPlugin } from "@/components/editor/plugins/toolbar/import-export-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { HR } from "@/components/editor/transformers/horizontal-rule-transformer";
import { IMAGE } from "@/components/editor/transformers/image-transformer";
import { TABLE } from "@/components/editor/transformers/table-transformer";
import { ToolbarSeparator } from "@/components/ui/toolbar";

// Only what Markdown can write. Highlight is left out of the text formats because
// Markdown has no syntax for it.
const MARKDOWN_TRANSFORMERS: Transformer[] = [
  TABLE,
  HR,
  IMAGE,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS.filter(
    (transformer) => !("format" in transformer && transformer.format.includes("highlight")),
  ),
  ...TEXT_MATCH_TRANSFORMERS,
];

const MARKDOWN_TEXT_FORMATS: TextFormatType[] = ["bold", "italic", "strikethrough", "code"];

export function DemoMarkdownEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/markdown",
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
          TableExtension,
          HorizontalRuleExtension,
          ImageExtension,
          DragDropPasteExtension,
          FormatStateExtension,
          ClearEditorExtension,
          ClipboardDOMImportExtension,
        ],
        register: (editor) =>
          mergeRegister(
            registerMarkdownShortcuts(editor, MARKDOWN_TRANSFORMERS),
            // Refuse the formats Markdown cannot write, from any source. Without this,
            // shortcuts such as Ctrl+U would still apply an underline that exports to nothing.
            editor.registerCommand(
              FORMAT_TEXT_COMMAND,
              (format) => !MARKDOWN_TEXT_FORMATS.includes(format),
              COMMAND_PRIORITY_HIGH,
            ),
          ),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <Toolbar>
          <HistoryToolbarPlugin />
          <ToolbarSeparator />
          <BlockFormatToolbarPlugin />
          <ToolbarSeparator />
          <TextFormatToolbarPlugin formats="markdown" />
          <LinkToolbarPlugin />
          <ToolbarSeparator />
          <BlockInsert>
            <InsertCodeBlockPlugin />
            <InsertHorizontalRulePlugin />
            <InsertImagePlugin />
            <InsertTablePlugin />
          </BlockInsert>
          <ToolbarSeparator />
          <ClearToolbarPlugin />
          <ImportExportToolbarPlugin transformers={MARKDOWN_TRANSFORMERS} />
        </Toolbar>
        <div className="relative flex min-h-80 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="draggable" className="flex-1" />
          <DraggableBlockPlugin />
          <FloatingToolbarPlugin>
            <TextFormatToolbarPlugin formats="markdown" />
            <ToolbarSeparator />
            <LinkToolbarPlugin />
          </FloatingToolbarPlugin>
          <LinkEditorPlugin />
          <TableHoverActionsPlugin />
          <ComponentPicker>
            <ParagraphPickerPlugin />
            <HeadingPickerPlugin />
            <TablePickerPlugin />
            <NumberedListPickerPlugin />
            <BulletedListPickerPlugin />
            <CheckListPickerPlugin />
            <QuotePickerPlugin />
            <CodePickerPlugin />
            <DividerPickerPlugin />
            <ImagePickerPlugin />
          </ComponentPicker>
        </div>
        <ActivityBar>
          <div className="flex items-center gap-3">
            <CountPlugin />
          </div>
          <div className="ms-auto flex items-center gap-3">
            <ReadOnlyTogglePlugin />
          </div>
        </ActivityBar>
      </div>
    </LexicalExtensionComposer>
  );
}
