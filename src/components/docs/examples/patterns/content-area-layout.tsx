"use client";

import { useMemo } from "react";

import { defineExtension } from "lexical";

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";

export function ContentAreaEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/content-area",
        namespace: "intentui-editor",
        dependencies: [RichTextExtension],
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="relative flex min-h-40 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable
            variant="toolbar"
            placeholder="Write something..."
            className="flex-1"
          />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
