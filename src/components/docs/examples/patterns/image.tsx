"use client";

import { InitialStateExtension } from "@lexical/extension";
import { registerMarkdownShortcuts } from "@lexical/markdown";
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

import { DragDropPasteExtension } from "@/components/editor/extensions/drag-drop-paste";
import { ImageExtension } from "@/components/editor/extensions/image";
import { $createImageNode } from "@/components/editor/nodes/image-node";
import { BlockInsert } from "@/components/editor/plugins/block-insert/block-insert-plugin";
import { InsertImagePlugin } from "@/components/editor/plugins/block-insert/insert-image-plugin";
import { ComponentPicker } from "@/components/editor/plugins/component-picker/component-picker-plugin";
import { ImagePickerPlugin } from "@/components/editor/plugins/component-picker/image-picker-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";
import { IMAGE } from "@/components/editor/transformers/image-transformer";

const SAMPLE_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#6366f1"/><circle cx="300" cy="70" r="30" fill="#fde68a"/><path d="M0 200 L120 80 L220 200Z M140 200 L260 110 L400 200Z" fill="#312e81"/></svg>',
  );

export function ImageEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/image",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          ImageExtension,
          DragDropPasteExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Click the image to select it, then drag its corner handle to resize.",
              ),
            ),
            $createParagraphNode().append(
              $createImageNode({
                altText: "Mountains at sunset",
                src: SAMPLE_IMAGE,
              }),
            ),
            $createParagraphNode().append(
              $createTextNode(
                "Use the toolbar, type /, paste, or drop a file to add more.",
              ),
            ),
          );
        },
        register: (editor) => registerMarkdownShortcuts(editor, [IMAGE]),
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-border bg-background">
        <Toolbar>
          <BlockInsert>
            <InsertImagePlugin />
          </BlockInsert>
        </Toolbar>
        <div className="relative flex min-h-80 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
          <ComponentPicker>
            <ImagePickerPlugin />
          </ComponentPicker>
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
