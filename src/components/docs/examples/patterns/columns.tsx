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

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { LayoutExtension } from "@/components/editor/extensions/layout";
import {
  $createLayoutContainerNode,
  $createLayoutItemNode,
} from "@/components/editor/nodes/layout-node";
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertColumnsPlugin } from "@/components/editor/plugins/block-insert/insert-columns-plugin";
import { ColumnsPickerPlugin } from "@/components/editor/plugins/component-picker/columns-picker-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function ColumnsEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/columns",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          LayoutExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createLayoutContainerNode("1fr 1fr").append(
              $createLayoutItemNode().append(
                $createParagraphNode().append($createTextNode("Left column")),
              ),
              $createLayoutItemNode().append(
                $createParagraphNode().append($createTextNode("Right column")),
              ),
            ),
            $createParagraphNode().append(
              $createTextNode("Use the toolbar or type / to add more columns."),
            ),
          );
        },
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-bg">
        <Toolbar>
          <BlockInsert>
            <InsertColumnsPlugin />
          </BlockInsert>
        </Toolbar>
        <div className="relative flex min-h-72 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
          <ComponentPicker>
            <ColumnsPickerPlugin />
          </ComponentPicker>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
