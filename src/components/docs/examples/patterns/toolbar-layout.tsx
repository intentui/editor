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

import { InitialStateExtension, TabIndentationExtension } from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { BlockFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin";
import { IndentToolbarPlugin } from "@/components/editor/plugins/toolbar/indent-toolbar-plugin";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { ToolbarSeparator } from "@/components/ui/toolbar";

export function ToolbarLayoutEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/toolbar-layout",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          TabIndentationExtension,
          ListExtension,
          CheckListExtension,
          FormatStateExtension,
          ShortcutsExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "The toolbar is a row of plugins. Resize the window and the row scrolls sideways instead of wrapping.",
              ),
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
          <HistoryToolbarPlugin />
          <ToolbarSeparator />
          <BlockFormatToolbarPlugin />
          <ToolbarSeparator />
          <TextFormatToolbarPlugin />
          <ToolbarSeparator />
          <ElementFormatToolbarPlugin />
          <ToolbarSeparator />
          <IndentToolbarPlugin />
        </Toolbar>
        <div className="relative flex min-h-40 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
