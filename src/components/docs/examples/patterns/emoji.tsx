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

import { registerMarkdownShortcuts } from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { EmojiExtension } from "@/components/editor/extensions/emoji-extension";
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertEmojiPlugin } from "@/components/editor/plugins/block-insert/insert-emoji-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { EMOJI } from "@/components/editor/transformers/emoji-transformer";

export function EmojiEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/emoji",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          EmojiExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode("Type : and a few letters, such as :smi, or write :tada: to add an emoji."),
            ),
          );
        },
        register: (editor) => registerMarkdownShortcuts(editor, [EMOJI]),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <Toolbar>
          <BlockInsert>
            <InsertEmojiPlugin />
          </BlockInsert>
        </Toolbar>
        <div className="relative flex min-h-72 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
          <EmojiPickerPlugin />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
