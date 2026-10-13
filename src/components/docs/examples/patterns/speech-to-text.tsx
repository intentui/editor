"use client";

import { useMemo } from "react";

import { defineExtension } from "lexical";

import { HistoryExtension } from "@lexical/history";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";

import { SpeechToTextExtension } from "@/components/editor/extensions/speech-to-text-extension";
import { ActivityBar } from "@/components/editor/plugins/activitybar/activitybar-plugin";
import { SpeechToTextPlugin } from "@/components/editor/plugins/activitybar/speech-to-text-plugin";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";

export function SpeechToTextEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@intentui-editor/speech-to-text",
        namespace: "intentui-editor",
        dependencies: [RichTextExtension, HistoryExtension, SpeechToTextExtension],
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
            placeholder="Click the microphone and start speaking..."
          />
        </div>
        <ActivityBar>
          <div className="ms-auto flex items-center gap-3">
            <SpeechToTextPlugin />
          </div>
        </ActivityBar>
      </div>
    </LexicalExtensionComposer>
  );
}
