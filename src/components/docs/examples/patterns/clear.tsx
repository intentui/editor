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

import { ClearEditorExtension, InitialStateExtension } from "@lexical/extension";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { ClearToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function ClearEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/clear",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          ClearEditorExtension,
          ShortcutsExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Select this "),
              $createTextNode("bold").toggleFormat("bold"),
              $createTextNode(" and "),
              $createTextNode("italic").toggleFormat("italic"),
              $createTextNode(" text and clear its formatting, or clear the whole editor."),
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
          <ClearToolbarPlugin />
        </Toolbar>
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
