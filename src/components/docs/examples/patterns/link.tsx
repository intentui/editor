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

import { $createLinkNode } from "@lexical/link";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { AutoLinkExtension } from "@/components/editor/extensions/auto-link";
import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { LinkExtension } from "@/components/editor/extensions/link";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { LinkEditorPlugin } from "@/components/editor/plugins/floating/link-editor-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function LinkEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/link",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          FormatStateExtension,
          LinkExtension,
          AutoLinkExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Select text and press the link button, or click an existing "),
              $createLinkNode("https://intentui.com").append($createTextNode("link")),
              $createTextNode(" to edit it."),
            ),
            $createParagraphNode().append(
              $createTextNode("Type or paste a URL at the end of this line and it becomes a link: "),
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
          <LinkToolbarPlugin />
        </Toolbar>
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
          <LinkEditorPlugin />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
