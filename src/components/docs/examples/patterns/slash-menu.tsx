"use client";

import { CheckListExtension, ListExtension } from "@lexical/list";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { defineExtension } from "lexical";
import { useMemo } from "react";

import { BulletedListPickerPlugin } from "@/components/editor/plugins/component-picker/bulleted-list-picker-plugin";
import { CheckListPickerPlugin } from "@/components/editor/plugins/component-picker/check-list-picker-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin";
import { NumberedListPickerPlugin } from "@/components/editor/plugins/component-picker/numbered-list-picker-plugin";
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin";
import { QuotePickerPlugin } from "@/components/editor/plugins/component-picker/quote-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";

export function SlashMenuEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/slash-menu",
        namespace: "intentui-editor",
        dependencies: [RichTextExtension, ListExtension, CheckListExtension],
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="relative flex min-h-80 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable
            variant="toolbar"
            className="flex-1"
            placeholder="Type / to insert a block..."
          />
          <ComponentPicker>
            <ParagraphPickerPlugin />
            <HeadingPickerPlugin />
            <NumberedListPickerPlugin />
            <BulletedListPickerPlugin />
            <CheckListPickerPlugin />
            <QuotePickerPlugin />
          </ComponentPicker>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
