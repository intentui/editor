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

import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { ColorToolbarPlugin } from "@/components/editor/plugins/toolbar/color-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function ColorEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/color",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          FormatStateExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Select some text, then pick a text or background color. "),
              $createTextNode("Red text. ").setStyle("color: #dc2626"),
              $createTextNode("Yellow background.").setStyle("background-color: #fde047"),
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
          <ColorToolbarPlugin />
        </Toolbar>
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
