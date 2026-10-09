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

import { HorizontalRuleExtension, InitialStateExtension } from "@lexical/extension";
import { CheckListExtension, ListExtension } from "@lexical/list";
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type Transformer,
} from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { $createHeadingNode, RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";

import { CodeExtension } from "@/components/editor/extensions/code";
import { EmojiExtension } from "@/components/editor/extensions/emoji";
import { ImageExtension } from "@/components/editor/extensions/image";
import { LinkExtension } from "@/components/editor/extensions/link";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { ImportExportToolbarPlugin } from "@/components/editor/plugins/toolbar/import-export-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { EMOJI } from "@/components/editor/transformers/emoji-transformer";
import { HR } from "@/components/editor/transformers/horizontal-rule-transformer";
import { IMAGE } from "@/components/editor/transformers/image-transformer";
import { TABLE } from "@/components/editor/transformers/table-transformer";

const EDITOR_TRANSFORMERS: Transformer[] = [
  TABLE,
  HR,
  IMAGE,
  EMOJI,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

export function ImportExportEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/import-export",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          ListExtension,
          CheckListExtension,
          LinkExtension,
          CodeExtension,
          TableExtension,
          HorizontalRuleExtension,
          ImageExtension,
          EmojiExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createHeadingNode("h2").append($createTextNode("Export me")),
            $createParagraphNode().append(
              $createTextNode("Use the toolbar to export this document as "),
              $createTextNode("Lexical JSON").toggleFormat("bold"),
              $createTextNode(", Markdown or HTML, or import a Lexical file."),
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
          <ImportExportToolbarPlugin transformers={EDITOR_TRANSFORMERS} />
        </Toolbar>
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
