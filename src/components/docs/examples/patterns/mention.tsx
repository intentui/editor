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

import { MentionExtension } from "@/components/editor/extensions/mention";
import { $createMentionNode } from "@/components/editor/nodes/mention-node";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { MentionPlugin } from "@/components/editor/plugins/mention-plugin";
import { editorTheme } from "@/components/editor/theme";

export function MentionEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/mention",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          MentionExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Thanks "),
              $createMentionNode("Leia Organa"),
              $createTextNode(" for the review."),
            ),
            $createParagraphNode().append(
              $createTextNode("Type @ and a name, for example @lu, to mention someone: "),
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
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="default" className="flex-1" />
          <MentionPlugin />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
