"use client";

import {
  InitialStateExtension,
  TabIndentationExtension,
} from "@lexical/extension";
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

import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { IndentToolbarPlugin } from "@/components/editor/plugins/toolbar/indent-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { ToolbarSeparator } from "@/components/ui/toolbar";

export function AlignmentAndIndentEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/alignment-and-indent",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          FormatStateExtension,
          TabIndentationExtension,
          ShortcutsExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("This paragraph is left aligned."),
            ),
            $createParagraphNode()
              .setFormat("center")
              .append($createTextNode("This paragraph is centered.")),
            $createParagraphNode()
              .setFormat("right")
              .append($createTextNode("This paragraph is right aligned.")),
            $createParagraphNode()
              .setIndent(1)
              .append($createTextNode("This paragraph is indented one level.")),
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
          <ElementFormatToolbarPlugin />
          <ToolbarSeparator />
          <IndentToolbarPlugin />
        </Toolbar>
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
