"use client";

import { InitialStateExtension } from "@lexical/extension";
import { $createLinkNode } from "@lexical/link";
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

import { LinkExtension } from "@/components/editor/extensions/link-extension";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { ContextMenuPlugin } from "@/components/editor/plugins/context-menu-plugin";
import { editorTheme } from "@/components/editor/theme";

export function ContextMenuEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/context-menu",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          LinkExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Right-click anywhere in this editor to open the menu.",
              ),
            ),
            $createParagraphNode().append(
              $createTextNode("Right-click a link, like "),
              $createLinkNode("https://lexical.dev").append(
                $createTextNode("this one"),
              ),
              $createTextNode(", to see Remove link."),
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
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="default" className="flex-1" />
          <ContextMenuPlugin />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
