"use client";

import { InitialStateExtension } from "@lexical/extension";
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

import { FormatStateExtension } from "@/components/editor/extensions/format-state-extension";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts-extension";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function TextFormatEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/text-format",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          FormatStateExtension,
          ShortcutsExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Select some text, then use the toolbar: "),
              $createTextNode("bold").toggleFormat("bold"),
              $createTextNode(", "),
              $createTextNode("italic").toggleFormat("italic"),
              $createTextNode(", "),
              $createTextNode("underline").toggleFormat("underline"),
              $createTextNode(", "),
              $createTextNode("strikethrough").toggleFormat("strikethrough"),
              $createTextNode(", "),
              $createTextNode("inline code").toggleFormat("code"),
              $createTextNode(", "),
              $createTextNode("highlight").toggleFormat("highlight"),
              $createTextNode(", and x"),
              $createTextNode("2").toggleFormat("superscript"),
              $createTextNode(" or H"),
              $createTextNode("2").toggleFormat("subscript"),
              $createTextNode("O."),
            ),
          );
        },
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <Toolbar>
          <TextFormatToolbarPlugin />
        </Toolbar>
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
