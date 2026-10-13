"use client";

import {
  $createHorizontalRuleNode,
  HorizontalRuleExtension,
  InitialStateExtension,
} from "@lexical/extension";
import { registerMarkdownShortcuts } from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  configExtension,
  defineExtension,
  HISTORY_MERGE_TAG,
} from "lexical";
import { useMemo } from "react";

import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertHorizontalRulePlugin } from "@/components/editor/plugins/block-insert/insert-horizontal-rule-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { DividerPickerPlugin } from "@/components/editor/plugins/component-picker/divider-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { HR } from "@/components/editor/transformers/horizontal-rule-transformer";

export function DividerEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/divider",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          HorizontalRuleExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Above the divider."),
            ),
            $createHorizontalRuleNode(),
            $createParagraphNode().append(
              $createTextNode(
                "Below it. On an empty line, type --- and press Space.",
              ),
            ),
          );
        },
        register: (editor) => registerMarkdownShortcuts(editor, [HR]),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <Toolbar>
          <BlockInsert>
            <InsertHorizontalRulePlugin />
          </BlockInsert>
        </Toolbar>
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
          <ComponentPicker>
            <DividerPickerPlugin />
          </ComponentPicker>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
