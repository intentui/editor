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

import { AutoLinkExtension } from "@/components/editor/extensions/auto-link";
import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { LinkExtension } from "@/components/editor/extensions/link";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { FloatingToolbarPlugin } from "@/components/editor/plugins/floating/floating-toolbar-plugin";
import { LinkEditorPlugin } from "@/components/editor/plugins/floating/link-editor-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { ToolbarSeparator } from "@/components/ui/toolbar";

export function FloatingToolbarEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/floating-toolbar",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          FormatStateExtension,
          ShortcutsExtension,
          LinkExtension,
          AutoLinkExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Select any of this text and a toolbar appears above the selection."),
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
        <div className="relative flex min-h-72 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
          <FloatingToolbarPlugin>
            <TextFormatToolbarPlugin />
            <ToolbarSeparator />
            <LinkToolbarPlugin />
          </FloatingToolbarPlugin>
          <LinkEditorPlugin />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
