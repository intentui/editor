"use client";

import { useMemo } from "react";

import { defineExtension } from "lexical";

import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { AutocompleteExtension } from "@/components/editor/extensions/autocomplete";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";

export function AutocompleteEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/autocomplete",
        namespace: "intentui-editor",
        dependencies: [RichTextExtension, AutocompleteExtension],
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable
            variant="toolbar"
            className="flex-1"
            placeholder="Type a word such as “inter” or “devel”, then press Tab..."
          />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
