"use client";

import {
  InitialStateExtension,
  TabIndentationExtension,
} from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { CheckListExtension, ListExtension } from "@lexical/list";
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

import { CodeExtension } from "@/components/editor/extensions/code-extension";
import { ShortcutsExtension } from "@/components/editor/extensions/shortcuts-extension";
import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { ShortcutPlugin } from "@/components/editor/plugins/activitybar/shortcut-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";

export function ShortcutsEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/shortcuts",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          HistoryExtension,
          TabIndentationExtension,
          ListExtension,
          CheckListExtension,
          CodeExtension,
          ShortcutsExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "Try Ctrl+Alt+1 for a heading or Ctrl+Shift+8 for a list. Open the shortcut list below.",
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
        <div className="relative flex min-h-56 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
        <ActivityBar>
          <div className="ms-auto flex items-center gap-3">
            <ShortcutPlugin />
          </div>
        </ActivityBar>
      </div>
    </LexicalExtensionComposer>
  );
}
