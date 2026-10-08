"use client";

import { useMemo } from "react";

import { configExtension, defineExtension } from "lexical";

import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import {
  AutoFocusExtension,
  ClearEditorExtension,
  HorizontalRuleExtension,
  TabIndentationExtension,
} from "@lexical/extension";
import { HashtagExtension } from "@lexical/hashtag";
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
import { AutocompleteExtension } from "@/components/editor/extensions/autocomplete";
import { CodeExtension } from "@/components/editor/extensions/code";
import { DragDropPasteExtension } from "@/components/editor/extensions/drag-drop-paste";
import { EmojiExtension } from "@/components/editor/extensions/emoji";
import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ImageExtension } from "@/components/editor/extensions/image";
import { LayoutExtension } from "@/components/editor/extensions/layout";
import { LinkExtension } from "@/components/editor/extensions/link";
import { MentionExtension } from "@/components/editor/extensions/mention";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { SpecialTextExtension } from "@/components/editor/extensions/special-text";
import { SpeechToTextExtension } from "@/components/editor/extensions/speech-to-text";
import { TabFocusExtension } from "@/components/editor/extensions/tab-focus";
import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { CountPlugin } from "@/components/editor/plugins/activitybar/count-plugin";
import { ReadOnlyTogglePlugin } from "@/components/editor/plugins/activitybar/read-only-toggle-plugin";
import { ShortcutPlugin } from "@/components/editor/plugins/activitybar/shortcut-plugin";
import { SpeechToTextPlugin } from "@/components/editor/plugins/activitybar/speech-to-text-plugin";
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertCodeBlockPlugin } from "@/components/editor/plugins/block-insert/insert-code-block-plugin";
import { InsertColumnsPlugin } from "@/components/editor/plugins/block-insert/insert-columns-plugin";
import { InsertEmojiPlugin } from "@/components/editor/plugins/block-insert/insert-emoji-plugin";
import { InsertHorizontalRulePlugin } from "@/components/editor/plugins/block-insert/insert-horizontal-rule-plugin";
import { InsertImagePlugin } from "@/components/editor/plugins/block-insert/insert-image-plugin";
import { InsertTablePlugin } from "@/components/editor/plugins/block-insert/insert-table-plugin";
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
import { ContextMenuPlugin } from "@/components/editor/plugins/context-menu-plugin";
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin";
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin";
import { FloatingToolbarPlugin } from "@/components/editor/plugins/floating/floating-toolbar-plugin";
import { LinkEditorPlugin } from "@/components/editor/plugins/floating/link-editor-plugin";
import { TableHoverActionsPlugin } from "@/components/editor/plugins/floating/table-hover-actions-plugin";

import { MentionPlugin } from "@/components/editor/plugins/mention-plugin";
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { ClearToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-toolbar-plugin";
import { ColorToolbarPlugin } from "@/components/editor/plugins/toolbar/color-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { ImportExportToolbarPlugin } from "@/components/editor/plugins/toolbar/import-export-toolbar-plugin";
import { IndentToolbarPlugin } from "@/components/editor/plugins/toolbar/indent-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { ToolbarSeparator } from "@/components/ui/toolbar";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { EMOJI } from "@/components/editor/transformers/emoji-transformer";
import { HR } from "@/components/editor/transformers/horizontal-rule-transformer";
import { IMAGE } from "@/components/editor/transformers/image-transformer";
import { TABLE } from "@/components/editor/transformers/table-transformer";

const EDITOR_TRANSFORMERS: Transformer[] = [
  TABLE,
  HR,
  IMAGE,
  EMOJI,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

export function DemoEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/demo",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          TabIndentationExtension,
          ListExtension,
          CheckListExtension,
          HashtagExtension,
          LinkExtension,
          AutoLinkExtension,
          CodeExtension,
          LayoutExtension,
          EmojiExtension,
          TableExtension,
          HorizontalRuleExtension,
          ImageExtension,
          MentionExtension,
          SpecialTextExtension,
          AutocompleteExtension,
          DragDropPasteExtension,
          TabFocusExtension,
          SpeechToTextExtension,
          ShortcutsExtension,
          FormatStateExtension,
          ClearEditorExtension,
          ClipboardDOMImportExtension,
          configExtension(AutoFocusExtension, {
            defaultSelection: "rootStart",
          }),
        ],
        register: (editor) => {
          return registerMarkdownShortcuts(editor, EDITOR_TRANSFORMERS);
        },
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-bg">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg">
          <Toolbar>
            <HistoryToolbarPlugin />
            <ToolbarSeparator />
            <BlockFormatToolbarPlugin />
            <FontFamilyToolbarPlugin />
            <FontSizeToolbarPlugin />
            <ToolbarSeparator />
            <ColorToolbarPlugin />
            <ToolbarSeparator />
            <TextFormatToolbarPlugin />
            <LinkToolbarPlugin />
            <ToolbarSeparator />
            <ElementFormatToolbarPlugin />
            <ToolbarSeparator />
            <IndentToolbarPlugin />
            <ToolbarSeparator />
            <BlockInsert>
              <InsertCodeBlockPlugin />
              <InsertColumnsPlugin />
              <InsertEmojiPlugin />
              <InsertHorizontalRulePlugin />
              <InsertImagePlugin />
              <InsertTablePlugin />
            </BlockInsert>
            <ToolbarSeparator />
            <ClearToolbarPlugin />
            <ImportExportToolbarPlugin transformers={EDITOR_TRANSFORMERS} />
          </Toolbar>
          <div className="relative flex h-[60vh] min-h-80 min-w-0 flex-1 flex-col overflow-y-auto">
            <ContentEditable variant="draggable" className="flex-1" />
            <DraggableBlockPlugin />
            <FloatingToolbarPlugin>
              <TextFormatToolbarPlugin />
              <ToolbarSeparator />
              <LinkToolbarPlugin />
            </FloatingToolbarPlugin>
            <LinkEditorPlugin />
            <TableHoverActionsPlugin />
            <EmojiPickerPlugin />
            <MentionPlugin />
            <ContextMenuPlugin />
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
              <ColumnsPickerPlugin />
              <ImagePickerPlugin />
            </ComponentPicker>
          </div>
          <ActivityBar>
            <div className="flex items-center gap-3">
              <CountPlugin />
            </div>
            <div className="ms-auto flex items-center gap-3">
              <SpeechToTextPlugin />
              <ReadOnlyTogglePlugin />
              <ShortcutPlugin />
            </div>
          </ActivityBar>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
