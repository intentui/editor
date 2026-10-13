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
import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { CountPlugin } from "@/components/editor/plugins/activitybar/count-plugin";
import { ReadOnlyTogglePlugin } from "@/components/editor/plugins/activitybar/read-only-toggle-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";

export function ActivityBarLayoutEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/activity-bar-layout",
        namespace: "intentui-editor",
        dependencies: [
          RichTextExtension,
          configExtension(InitialStateExtension, {
            updateOptions: { tag: HISTORY_MERGE_TAG, discrete: true },
          }),
        ],
        $initialEditorState: () => {
          $getRoot().append(
            $createParagraphNode().append(
              $createTextNode(
                "The activity bar sits under the content area. Type here and watch the counts change.",
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
        <div className="relative flex min-h-40 min-w-0 flex-1 flex-col overflow-y-auto">
          <ContentEditable variant="toolbar" className="flex-1" />
        </div>
        <ActivityBar>
          <div className="flex items-center gap-3">
            <CountPlugin />
          </div>
          <div className="ms-auto flex items-center gap-3">
            <ReadOnlyTogglePlugin />
          </div>
        </ActivityBar>
      </div>
    </LexicalExtensionComposer>
  );
}
