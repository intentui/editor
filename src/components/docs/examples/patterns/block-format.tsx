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

import { CheckListExtension, ListExtension } from "@lexical/list";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { $createHeadingNode, RichTextExtension } from "@lexical/rich-text";

import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function BlockFormatEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/block-format",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          ListExtension,
          CheckListExtension,
          ShortcutsExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createHeadingNode("h2").append($createTextNode("Block format")),
            $createParagraphNode().append(
              $createTextNode("Place the cursor in this paragraph and pick a block type."),
            ),
            $createParagraphNode().append(
              $createTextNode("Try a list, a quote or a heading on this one."),
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
          <BlockFormatToolbarPlugin />
        </Toolbar>
        <div className="relative flex min-h-72 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
