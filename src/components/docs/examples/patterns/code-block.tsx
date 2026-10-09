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

import { $createCodeNode } from "@lexical/code-core";
import {
  MULTILINE_ELEMENT_TRANSFORMERS,
  registerMarkdownShortcuts,
} from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { CodeExtension } from "@/components/editor/extensions/code";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertCodeBlockPlugin } from "@/components/editor/plugins/block-insert/insert-code-block-plugin";
import { CodePickerPlugin } from "@/components/editor/plugins/component-picker/code-picker-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function CodeBlockEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/code-block",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          CodeExtension,
          ShortcutsExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Type ```js and press Space to start a new code block."),
            ),
            $createCodeNode("js").append(
              $createTextNode('function greet(name) {\n  return `Hello, ${name}!`;\n}'),
            ),
          );
        },
        register: (editor) => registerMarkdownShortcuts(editor, MULTILINE_ELEMENT_TRANSFORMERS),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <Toolbar>
          <BlockInsert>
            <InsertCodeBlockPlugin />
          </BlockInsert>
        </Toolbar>
        <div className="relative flex min-h-72 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
          <ComponentPicker>
            <CodePickerPlugin />
          </ComponentPicker>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
