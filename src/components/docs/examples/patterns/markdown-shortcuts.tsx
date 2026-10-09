"use client";

import { useMemo } from "react";

import { defineExtension } from "lexical";

import { HorizontalRuleExtension } from "@lexical/extension";
import { CheckListExtension, ListExtension } from "@lexical/list";
import {
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type Transformer,
  registerMarkdownShortcuts,
} from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { CodeExtension } from "@/components/editor/extensions/code";
import { LinkExtension } from "@/components/editor/extensions/link";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";
import { HR } from "@/components/editor/transformers/horizontal-rule-transformer";

const TRANSFORMERS: Transformer[] = [
  HR,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

export function MarkdownShortcutsEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/markdown-shortcuts",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          ListExtension,
          CheckListExtension,
          LinkExtension,
          CodeExtension,
          HorizontalRuleExtension,
        ],
        register: (editor) => registerMarkdownShortcuts(editor, TRANSFORMERS),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="relative flex min-h-72 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable
            variant="toolbar"
            className="flex-1"
            placeholder="Type # then a space, - then a space, **bold**, or ``` for a code block..."
          />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
