"use client";

import { useMemo } from "react";

import { defineExtension } from "lexical";

import { HorizontalRuleExtension } from "@lexical/extension";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";

import { CodeExtension } from "@/components/editor/extensions/code-extension";
import { ImageExtension } from "@/components/editor/extensions/image-extension";
import { LayoutExtension } from "@/components/editor/extensions/layout-extension";
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertCodeBlockPlugin } from "@/components/editor/plugins/block-insert/insert-code-block-plugin";
import { InsertColumnsPlugin } from "@/components/editor/plugins/block-insert/insert-columns-plugin";
import { InsertHorizontalRulePlugin } from "@/components/editor/plugins/block-insert/insert-horizontal-rule-plugin";
import { InsertImagePlugin } from "@/components/editor/plugins/block-insert/insert-image-plugin";
import { InsertTablePlugin } from "@/components/editor/plugins/block-insert/insert-table-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function InsertBlockMenuEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/insert-block-menu",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          CodeExtension,
          LayoutExtension,
          HorizontalRuleExtension,
          ImageExtension,
          TableExtension,
        ],
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <Toolbar>
          <BlockInsert>
            <InsertCodeBlockPlugin />
            <InsertColumnsPlugin />
            <InsertHorizontalRulePlugin />
            <InsertImagePlugin />
            <InsertTablePlugin />
          </BlockInsert>
        </Toolbar>
        <div className="relative flex min-h-80 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable
            variant="toolbar"
            className="flex-1"
            placeholder="Use the buttons above to insert a block..."
          />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
