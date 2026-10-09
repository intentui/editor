"use client";

import { useMemo } from "react";

import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  HISTORY_MERGE_TAG,
  configExtension,
  defineExtension,
} from "lexical";

import { InitialStateExtension } from "@lexical/extension";

import { $convertFromMarkdownString, registerMarkdownShortcuts } from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";

import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertTablePlugin } from "@/components/editor/plugins/block-insert/insert-table-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { TablePickerPlugin } from "@/components/editor/plugins/component-picker/table-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { TableHoverActionsPlugin } from "@/components/editor/plugins/floating/table-hover-actions-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { TABLE } from "@/components/editor/transformers/table-transformer";

const SAMPLE_TABLE = `| Plan | Seats | Price |
| --- | --- | --- |
| Starter | 1 | Free |
| Team | 10 | $20 |`;

export function TableEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/table",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          TableExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Hover the first row or column to add and remove cells."),
            ),
          );
          $convertFromMarkdownString(SAMPLE_TABLE, [TABLE], undefined, false);
        },
        register: (editor) => registerMarkdownShortcuts(editor, [TABLE]),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <Toolbar>
          <BlockInsert>
            <InsertTablePlugin />
          </BlockInsert>
        </Toolbar>
        <div className="relative flex min-h-80 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
          <TableHoverActionsPlugin />
          <ComponentPicker>
            <TablePickerPlugin />
          </ComponentPicker>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
