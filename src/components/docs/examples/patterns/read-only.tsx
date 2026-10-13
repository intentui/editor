"use client";

import { InitialStateExtension } from "@lexical/extension";
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

import { FormatStateExtension } from "@/components/editor/extensions/format-state";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts";
import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { ReadOnlyTogglePlugin } from "@/components/editor/plugins/activitybar/read-only-toggle-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { TextFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/text-format-toolbar-plugin";
import { Toolbar } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { editorTheme } from "@/components/editor/theme";

export function ReadOnlyEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/read-only",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          FormatStateExtension,
          ShortcutsExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Click the lock in the activity bar. The toolbar disables and typing stops.",
              ),
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
          <TextFormatToolbarPlugin formats="basic" />
        </Toolbar>
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
        <ActivityBar>
          <div className="ms-auto flex items-center gap-3">
            <ReadOnlyTogglePlugin />
          </div>
        </ActivityBar>
      </div>
    </LexicalExtensionComposer>
  );
}
