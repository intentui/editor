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
import { $createHeadingNode, RichTextExtension } from "@lexical/rich-text";

import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { HeadingPickerPlugin } from "@/components/editor/plugins/component-picker/heading-picker-plugin";
import { ParagraphPickerPlugin } from "@/components/editor/plugins/component-picker/paragraph-picker-plugin";
import { QuotePickerPlugin } from "@/components/editor/plugins/component-picker/quote-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin";
import { editorTheme } from "@/components/editor/theme";

export function DraggableBlockEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/draggable-block",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createHeadingNode("h2").append($createTextNode("Drag me")),
            $createParagraphNode().append(
              $createTextNode("Hover a block to reveal the handle in the left margin."),
            ),
            $createParagraphNode().append(
              $createTextNode("Drag the grip to move a block, or click the plus to insert one."),
            ),
            $createParagraphNode().append($createTextNode("Drop a block between two others.")),
          );
        },
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="relative flex min-h-80 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="draggable" className="flex-1" />
          <DraggableBlockPlugin />
          <ComponentPicker>
            <ParagraphPickerPlugin />
            <HeadingPickerPlugin />
            <QuotePickerPlugin />
          </ComponentPicker>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
